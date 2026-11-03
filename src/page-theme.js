import { resolveTheme, sanitizeTheme } from './colors.js';
export const COLOR_ORIGINS = ['<all_urls>'];
export function applyTheme(theme,root=document.documentElement) {
  root.dataset.theme=theme;root.dataset.logo=theme==='dark'?'white':'black';
}
// A manual choice remains in effect across tabs/restarts. Only Auto samples pages.
export async function startPageTheme({toggle,auto,access,preference,onPreference,report}) {
  const media=globalThis.matchMedia?.('(prefers-color-scheme: dark)');
  let mode=sanitizeTheme(preference),detected=null,hasAccess=null,disposed=false,busy=false,generation=0;
  let refresh=()=>{},windowId;
  function render() {
    const theme=resolveTheme(mode,detected,media?.matches);
    applyTheme(theme);
    toggle.textContent=theme==='dark'?'☀':'☾';
    toggle.setAttribute('aria-checked',String(theme==='dark'));
    toggle.setAttribute('aria-label','Dark mode');
    toggle.title=`Switch to ${theme==='dark'?'light':'dark'} mode`;
    auto.hidden=mode==='auto';
    access.hidden=mode!=='auto' || hasAccess!==false;
  }
  const setPreference=value=>{
    const next=sanitizeTheme(value);
    if(next===mode) return;
    mode=next;generation++;render();if(mode==='auto') refresh();
  };
  const choose=value=>{setPreference(value);onPreference(mode);};
  toggle.addEventListener('click',()=>choose(resolveTheme(mode,detected,media?.matches)==='dark'?'light':'dark'));
  auto.addEventListener('click',()=>choose('auto'));
  const onMedia=()=>render();media?.addEventListener('change',onMedia);
  render();
  const controller={setPreference};
  if(!globalThis.chrome?.runtime?.id) {
    window.addEventListener('pagehide',()=>media?.removeEventListener('change',onMedia),{once:true});
    return controller;
  }
  ({id:windowId}=await chrome.windows.getCurrent());
  refresh=async()=>{
    if(disposed || busy || mode!=='auto' || document.visibilityState==='hidden') return;
    busy=true;const request=++generation;
    try {
      const result=await chrome.runtime.sendMessage({type:'sample-page-scheme',windowId});
      if(!disposed && request===generation && mode==='auto') {detected=result?.scheme ?? null;render();}
    } catch {if(!disposed && request===generation) {detected=null;render();}}
    finally {busy=false;}
  };
  const permissionState=async()=>{
    try {hasAccess=await chrome.permissions.contains({origins:COLOR_ORIGINS});}catch {hasAccess=false;}
    render();refresh();
  };
  access.addEventListener('click',()=>{
    // Ask only in response to the user's explicit click, before any await.
    chrome.permissions.request({origins:COLOR_ORIGINS}).then(granted=>{
      if(granted) permissionState();else report('Automatic detection is limited to pages where you click VerbeFlow. You can always choose light or dark mode yourself.');
    }).catch(()=>report('Automatic page detection could not be enabled. The theme toggle still works.'));
  });
  const onTab=info=>{if(info.windowId===windowId) {generation++;detected=null;render();refresh();}};
  const onUpdate=(_id,change,tab)=>{if(tab.active && tab.windowId===windowId && (change.status || change.url)) {generation++;detected=null;render();refresh();}};
  const onVisibility=()=>refresh();
  const onRequest=(message,sender)=>{if(sender.id===chrome.runtime.id && message?.type==='refresh-page-scheme' && message.windowId===windowId) refresh();};
  chrome.runtime.onMessage.addListener(onRequest);
  chrome.tabs.onActivated.addListener(onTab);chrome.tabs.onUpdated.addListener(onUpdate);
  chrome.permissions.onAdded.addListener(permissionState);chrome.permissions.onRemoved.addListener(permissionState);
  document.addEventListener('visibilitychange',onVisibility);
  const interval=setInterval(refresh,3500);
  window.addEventListener('pagehide',()=>{
    disposed=true;clearInterval(interval);
    chrome.runtime.onMessage.removeListener(onRequest);
    chrome.tabs.onActivated.removeListener(onTab);chrome.tabs.onUpdated.removeListener(onUpdate);
    chrome.permissions.onAdded.removeListener(permissionState);chrome.permissions.onRemoved.removeListener(permissionState);
    document.removeEventListener('visibilitychange',onVisibility);media?.removeEventListener('change',onMedia);
  },{once:true});
  await permissionState();return controller;
}

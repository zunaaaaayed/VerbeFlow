import { resolveTheme, sanitizeTheme } from './colors.js';
export function applyTheme(theme,root=document.documentElement) {
  root.dataset.theme=theme;root.dataset.logo=theme==='dark'?'white':'black';
}
// Auto follows the browser/system preference. No tab access or Chrome APIs.
export async function startPageTheme({toggle,auto,preference,onPreference}) {
  const media=globalThis.matchMedia?.('(prefers-color-scheme: dark)');
  let mode=sanitizeTheme(preference);
  function render() {
    const theme=resolveTheme(mode,media?.matches);
    applyTheme(theme);
    toggle.textContent=theme==='dark'?'☀':'☾';
    toggle.setAttribute('aria-checked',String(theme==='dark'));
    toggle.setAttribute('aria-label','Dark mode');
    toggle.title=`Switch to ${theme==='dark'?'light':'dark'} mode`;
    auto.hidden=mode==='auto';
  }
  const setPreference=value=>{mode=sanitizeTheme(value);render();};
  const choose=value=>{setPreference(value);onPreference(mode);};
  toggle.addEventListener('click',()=>choose(resolveTheme(mode,media?.matches)==='dark'?'light':'dark'));
  auto.addEventListener('click',()=>choose('auto'));
  media?.addEventListener('change',render);
  window.addEventListener('pagehide',()=>media?.removeEventListener('change',render),{once:true});
  render();return {setPreference};
}

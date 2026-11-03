import { detectPageScheme } from './colors.js';

// Open synchronously from the toolbar gesture; no popup or async work precedes it.
chrome.action.onClicked.addListener(tab => {
  chrome.sidePanel.open({windowId:tab.windowId}).then(()=>{
    // An already-open panel also needs an immediate refresh after activeTab is granted.
    chrome.runtime.sendMessage({type:'refresh-page-scheme',windowId:tab.windowId}).catch(()=>{});
  }).catch(error=>console.error('Could not open VerbeFlow side panel:',error));
});

// Requests exist only while the side panel is open. One in-flight capture per
// window prevents event/timer bursts from exceeding Chrome's capture rate limit.
const pending=new Map();
async function samplePage(windowId) {
  const [before]=await chrome.tabs.query({active:true,windowId});
  if(!before?.id) return {scheme:null};
  try {
    const data=await chrome.tabs.captureVisibleTab(windowId,{format:'jpeg',quality:35});
    const [after]=await chrome.tabs.query({active:true,windowId});
    if(after?.id!==before.id) return {scheme:null};
    const blob=await (await fetch(data)).blob();
    const bitmap=await createImageBitmap(blob);
    try {
      const canvas=new OffscreenCanvas(96,64),ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.drawImage(bitmap,0,0,96,64);
      return {scheme:detectPageScheme(ctx.getImageData(0,0,96,64).data)};
    } finally {bitmap.close();}
  } catch {return {scheme:null};} // Restricted/ungranted tabs use the neutral fallback.
}
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(sender.id!==chrome.runtime.id || sender.url!==chrome.runtime.getURL('sidepanel.html') || message?.type!=='sample-page-scheme' || !Number.isInteger(message.windowId)) return;
  if(!pending.has(message.windowId)) {
    const task=samplePage(message.windowId).catch(()=>({scheme:null}));
    pending.set(message.windowId,task);
    task.finally(()=>pending.delete(message.windowId));
  }
  pending.get(message.windowId).then(reply);
  return true;
});

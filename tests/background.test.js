import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('toolbar opens the panel directly; page sampling handles pixels, stale tabs, and unavailable access',async()=>{
 let clicked,message;let rejectCapture=false,changeTab=false,queries=0,closed=0,opened;
 const previous={chrome:globalThis.chrome,fetch:globalThis.fetch,createImageBitmap:globalThis.createImageBitmap,OffscreenCanvas:globalThis.OffscreenCanvas};
 globalThis.chrome={action:{onClicked:{addListener:fn=>clicked=fn}},sidePanel:{open:options=>{opened=options;return Promise.resolve();}},runtime:{sendMessage:async()=>{},id:'vf',getURL:path=>'chrome-extension://vf/'+path,onMessage:{addListener:fn=>message=fn}},tabs:{query:async()=>[{id:changeTab && ++queries>1?2:1}],captureVisibleTab:async()=>{if(rejectCapture)throw Error('no access');return 'data:image/jpeg;base64,local-only';}}};
 globalThis.fetch=async()=>({blob:async()=>({})});globalThis.createImageBitmap=async()=>({close:()=>closed++});
 globalThis.OffscreenCanvas=class{getContext(){return {drawImage(){},getImageData:()=>({data:new Uint8ClampedArray([16,32,48,255])})};}};
 const sender={id:'vf',url:'chrome-extension://vf/sidepanel.html'};
 try {
  await import('../src/background.js?test');
  clicked({windowId:7});assert.deepEqual(opened,{windowId:7}); // no async permission/color work before open
  assert.equal(message({type:'sample-page-scheme',windowId:7},{id:'other'},()=>{}),undefined);
  const sample=()=>new Promise(resolve=>assert.equal(message({type:'sample-page-scheme',windowId:7},sender,resolve),true));
  assert.deepEqual(await sample(),{scheme:'dark'});assert.equal(closed,1);
  rejectCapture=true;assert.deepEqual(await sample(),{scheme:null});
  rejectCapture=false;changeTab=true;queries=0;assert.deepEqual(await sample(),{scheme:null});
  const manifest=JSON.parse(readFileSync(new URL('../manifest.json',import.meta.url)));
  assert.equal(manifest.action.default_popup,undefined);assert.equal(manifest.background.service_worker,'src/background.js');
  assert.equal(manifest.host_permissions,undefined);assert.deepEqual(manifest.optional_host_permissions,['<all_urls>']);
 } finally {Object.assign(globalThis,previous);}
});

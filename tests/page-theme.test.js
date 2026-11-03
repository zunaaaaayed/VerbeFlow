import test from 'node:test';
import assert from 'node:assert/strict';
import { startPageTheme } from '../src/page-theme.js';
test('manual toggle overrides tabs, stops page sampling, and Auto resumes detection',async()=>{
 const saved=Object.fromEntries(['chrome','document','window','matchMedia','setInterval','clearInterval'].map(k=>[k,globalThis[k]]));
 const event=()=>({listener:null,addListener(fn){this.listener=fn;},removeListener(fn){if(this.listener===fn)this.listener=null;}});
 const active=event(),updated=event(),added=event(),removed=event(),messages=event();
 const root={dataset:{}};
 let resolveCapture,timer,closed=false,onClose,requested=false,notice,captures=0;
 const control=()=>({hidden:true,attributes:{},addEventListener(_type,fn){this.click=fn;},setAttribute(k,v){this.attributes[k]=v;}});
 const toggle=control(),auto=control(),access=control(),preferences=[];
 globalThis.chrome={windows:{getCurrent:async()=>({id:7})},runtime:{onMessage:messages,id:'vf',sendMessage:()=>{captures++;return new Promise(resolve=>resolveCapture=resolve);}},permissions:{contains:async()=>false,request:()=>{requested=true;return Promise.resolve(false);},onAdded:added,onRemoved:removed},tabs:{onActivated:active,onUpdated:updated}};
 globalThis.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 globalThis.document={documentElement:root,visibilityState:'visible',addEventListener(){},removeEventListener(){}};
 globalThis.window={addEventListener:(_type,fn)=>onClose=fn};globalThis.setInterval=fn=>{timer=fn;return 1;};globalThis.clearInterval=()=>closed=true;
 try {
  const controller=await startPageTheme({toggle,auto,access,preference:'auto',onPreference:p=>preferences.push(p),report:m=>notice=m});
  assert.equal(access.hidden,false);assert.equal(auto.hidden,true);
  active.listener({windowId:7});resolveCapture({scheme:'dark'});await Promise.resolve();
  assert.equal(root.dataset.theme,'light'); // stale result from previous tab discarded
  timer();resolveCapture({scheme:'light'});await Promise.resolve();
  toggle.click();assert.equal(root.dataset.theme,'dark');assert.equal(root.dataset.logo,'white');assert.equal(toggle.attributes['aria-checked'],'true');assert.equal(auto.hidden,false);assert.equal(access.hidden,true);
  const before=captures;timer();active.listener({windowId:7});assert.equal(captures,before);assert.equal(root.dataset.theme,'dark');assert.deepEqual(preferences,['dark']);
  auto.click();resolveCapture({scheme:'dark'});await Promise.resolve();assert.equal(root.dataset.theme,'dark');assert.equal(auto.hidden,true);assert.deepEqual(preferences,['dark','auto']);
  access.click();assert.equal(requested,true);await Promise.resolve();assert.match(notice,/choose light or dark/);
  controller.setPreference('light');assert.equal(root.dataset.theme,'light');assert.equal(root.dataset.logo,'black');
  onClose();assert.equal(closed,true);assert.equal(active.listener,null);assert.equal(updated.listener,null);assert.equal(messages.listener,null);
 } finally {Object.assign(globalThis,saved);}
});

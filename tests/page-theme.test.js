import test from 'node:test';
import assert from 'node:assert/strict';
import {startPageTheme} from '../src/page-theme.js';
test('Auto follows system changes, manual overrides persist, and no Chrome APIs are accessed',async()=>{
 const saved=Object.fromEntries(['chrome','document','window','matchMedia'].map(k=>[k,globalThis[k]]));
 let onChange,onClose,removed=false;const preferences=[];
 const control=()=>({hidden:true,setAttribute(){},addEventListener(_type,fn){this.click=fn;}});
 const toggle=control(),auto=control(),media={matches:false,addEventListener(_type,fn){onChange=fn;},removeEventListener(){removed=true;}};
 globalThis.chrome=new Proxy({},{get(){throw Error('Chrome access forbidden');}});
 globalThis.document={documentElement:{dataset:{}}};globalThis.window={addEventListener:(_type,fn)=>onClose=fn};globalThis.matchMedia=()=>media;
 try{const controller=await startPageTheme({toggle,auto,preference:'auto',onPreference:p=>preferences.push(p)});
 assert.equal(document.documentElement.dataset.theme,'light');media.matches=true;onChange();assert.equal(document.documentElement.dataset.theme,'dark');
 toggle.click();assert.equal(document.documentElement.dataset.theme,'light');onChange();assert.equal(document.documentElement.dataset.theme,'light');auto.click();assert.equal(document.documentElement.dataset.theme,'dark');
 controller.setPreference('light');assert.equal(document.documentElement.dataset.theme,'light');assert.deepEqual(preferences,['light','auto']);onClose();assert.ok(removed);
 }finally{Object.assign(globalThis,saved);}
});

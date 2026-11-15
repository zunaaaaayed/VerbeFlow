import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('toolbar opens side panel synchronously without tab access or screenshot permissions',async()=>{
 const old=globalThis.chrome;let clicked,opened;
 globalThis.chrome={action:{onClicked:{addListener:fn=>clicked=fn}},sidePanel:{open:options=>{opened=options;return Promise.resolve();}}};
 try {await import('../src/background.js?no-page-access');clicked({windowId:7});assert.deepEqual(opened,{windowId:7});
 const manifest=JSON.parse(readFileSync(new URL('../manifest.json',import.meta.url)));
 assert.deepEqual(manifest.permissions,['storage','sidePanel','tts']);assert.equal(manifest.optional_host_permissions,undefined);
 assert.equal(manifest.action.default_popup,undefined);
 }finally{globalThis.chrome=old;}
});

import test from 'node:test';
import assert from 'node:assert/strict';
test('extension storage patches keys, reports failures, and receives panel changes', async () => {
 const data={selected:'parler',tense:'present',bookmarks:['être']}; let listener, fail=false;
 globalThis.chrome={storage:{local:{get:async()=>{if(fail)throw Error('unavailable');return data;},set:async patch=>{if(fail)throw Error('quota');Object.assign(data,patch);}},onChanged:{addListener:fn=>{listener=fn;}}}};
 try {
  const {readState,saveState,subscribe}=await import('../src/storage.js?extension-test');
  await saveState({theme:'dark'});assert.equal((await readState()).theme,'dark');
  await saveState({theme:'invalid'});assert.equal((await readState()).theme,'auto');
  await saveState({tense:'future'});assert.equal((await readState()).selected,'parler');assert.deepEqual(data.bookmarks,['être']);
  let updates=0;subscribe(()=>updates++);listener({},'sync');listener({},'local');assert.equal(updates,1);
  const { VERBS } = await import('../src/data/verbs.js');
  await saveState({bookmarks:VERBS.slice(0,14).map(v=>v.infinitive)});assert.equal(data.bookmarks.length,10);
  fail=true;await assert.rejects(readState);await assert.rejects(()=>saveState({selected:'avoir'}));
 } finally {delete globalThis.chrome;}
});
test('page-preview storage recovers older/corrupt values and merges patches', async () => {
 let stored='{broken';let handler;
 globalThis.localStorage={getItem:()=>stored,setItem:(_,v)=>{stored=v;}};
 globalThis.window={addEventListener:(_,fn)=>{handler=fn;}};
 try {
  const {readState,saveState,subscribe}=await import('../src/storage.js?preview-test');
  assert.equal((await readState()).selected,'parler');
  await saveState({bookmarks:['avoir']});await saveState({tense:'imperfect'});
  assert.deepEqual((await readState()).bookmarks,['avoir']);
  let updates=0;subscribe(()=>updates++);handler({key:'other'});handler({key:'verbeflow'});assert.equal(updates,1);
 } finally {delete globalThis.localStorage;delete globalThis.window;}
});

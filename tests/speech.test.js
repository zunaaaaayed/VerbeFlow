import test from 'node:test';
import assert from 'node:assert/strict';
import { frenchVoice, speechController } from '../src/speech.js';
const english={lang:'en-US',voiceName:'English',localService:true};
const french={lang:'fr-FR',voiceName:'French',remote:false};
test('French voice selection never chooses the English default and prefers local French',()=>{
 assert.equal(frenchVoice([english,{lang:'fr-CA',remote:true},french]),french);
 assert.equal(frenchVoice([english,{lang:'frenglish'}]),null);
});
function platform(voices) {
 const calls=[];const p={chrome:{runtime:{},tts:{getVoices:cb=>cb(voices),stop:()=>calls.push('stop'),speak:(text,options,cb)=>{calls.push({text,options});cb();}}},setTimeout:()=>0,clearTimeout:()=>{}};
 return {p,calls};
}
test('native extension TTS explicitly binds the French voice and language',()=>{
 const {p,calls}=platform([english,french]);let ready;const errors=[];
 const speech=speechController({onReady:r=>ready=r,onError:e=>errors.push(e)},p);
 assert.equal(ready,true);speech.speak('Je suis allé(e).');
 assert.equal(calls[1].text,'Je suis allé.');assert.equal(calls[1].options.voiceName,'French');assert.equal(calls[1].options.lang,'fr-FR');
 calls[1].options.onEvent({type:'error'});assert.equal(errors.length,1);speech.dispose();
});
test('missing French voice does not trigger English audio',()=>{
 const {p,calls}=platform([english]);let ready;let message;
 const speech=speechController({onReady:r=>ready=r,onError:e=>message=e},p);
 assert.equal(ready,false);speech.speak('Bonjour.');assert.deepEqual(calls,[]);assert.match(message,/French system voice/);speech.dispose();
});
test('web preview binds the actual French voice object instead of the default',()=>{
 const chosen={lang:'fr-FR',name:'French',localService:true};let utterance;
 const p={speechSynthesis:{getVoices:()=>[english,chosen],addEventListener(){},removeEventListener(){},cancel(){},speak:u=>utterance=u},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},setTimeout:()=>0,clearTimeout:()=>{}};
 const speech=speechController({onReady(){},onError:assert.fail},p);speech.speak('Bonjour.');
 assert.equal(utterance.voice,chosen);assert.equal(utterance.lang,'fr-FR');speech.dispose();
});

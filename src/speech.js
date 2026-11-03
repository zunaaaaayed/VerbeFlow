// Never fall back to a default English voice. Chrome's native TTS backend avoids
// SpeechSynthesis's extension-context/default-voice selection inconsistencies.
export function frenchVoice(voices) {
  return voices.filter(v=>/^fr(?:[-_]|$)/i.test(v.lang ?? '')).sort((a,b)=>score(b)-score(a))[0] ?? null;
}
function score(v) {
  return ((v.remote===false || v.localService===true)?100:0)+(/^fr[-_]FR$/i.test(v.lang)?20:0);
}
export function speechController({onReady,onError}, platform=globalThis) {
  const native=platform.chrome?.tts;
  let chosen=null,disposed=false,started=false;
  const update=()=>{
    if(native) native.getVoices(voices=>{
      if(platform.chrome.runtime.lastError) {chosen=null;} else chosen=frenchVoice(voices);
      if(!disposed) onReady(!!chosen,chosen);
    });
    else {chosen=frenchVoice(platform.speechSynthesis?.getVoices() ?? []);onReady(!!chosen,chosen);}
  };
  update();
  platform.speechSynthesis?.addEventListener('voiceschanged',update);
  // Chrome TTS may finish loading system voices after panel startup.
  const retry=platform.setTimeout(update,1200);
  return {
    speak(text) {
      // Re-query browser voices synchronously to avoid a stale default voice.
      if(!native) chosen=frenchVoice(platform.speechSynthesis?.getVoices() ?? []);
      if(!chosen) {onReady(false);onError('Install a French system voice to hear French pronunciation.');return;}
      started=true;
      const sentence=text.replace(/\(e\)|\(s\)/g,'');
      if(native) {
        native.stop();
        const options={voiceName:chosen.voiceName,lang:chosen.lang.replace('_','-'),rate:.85,enqueue:false,
          onEvent:event=>{if(event.type==='error') onError('French pronunciation is unavailable. Check your installed French voice.');}};
        if(chosen.extensionId) options.extensionId=chosen.extensionId;
        native.speak(sentence,options,()=>{if(platform.chrome.runtime.lastError) onError('French pronunciation is unavailable. Check your installed French voice.');});
      } else {
        platform.speechSynthesis.cancel();
        const utterance=new platform.SpeechSynthesisUtterance(sentence);
        utterance.voice=chosen;utterance.lang=chosen.lang.replace('_','-');utterance.rate=.85;
        utterance.onerror=()=>onError('French pronunciation is unavailable. Please try again.');
        platform.speechSynthesis.speak(utterance);
      }
    },
    dispose() {
      disposed=true;platform.clearTimeout(retry);
      platform.speechSynthesis?.removeEventListener('voiceschanged',update);
      if(started) {if(native) native.stop();else platform.speechSynthesis?.cancel();}
    },
  };
}

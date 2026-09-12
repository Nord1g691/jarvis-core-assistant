(()=>{
  const BODY=document.body;
  if(!BODY||window.__jarvisFinalRuntime)return;
  window.__jarvisFinalRuntime=true;

  const CLASSES=['jarvis-listening','jarvis-thinking','jarvis-searching','jarvis-speaking'];
  const LABELS={idle:'EN LIGNE',operational:'EN LIGNE',listening:'ÉCOUTE',thinking:'RÉFLEXION',searching:'RECHERCHE',speaking:'PAROLE'};
  const CLASS_BY_STATE={listening:'jarvis-listening',thinking:'jarvis-thinking',searching:'jarvis-searching',speaking:'jarvis-speaking'};
  let state='idle';
  let releaseTimer=0;
  let mediaDepth=0;

  function normalize(v){
    v=String(v||'').trim().toLowerCase();
    if(['listen','listening','écoute','ecoute','hearing'].includes(v))return'listening';
    if(['think','thinking','réflexion','reflexion','processing','process'].includes(v))return'thinking';
    if(['search','searching','recherche','analyse','analyzing','analysing'].includes(v))return'searching';
    if(['speak','speaking','parole','talking','tts','response'].includes(v))return'speaking';
    return'idle';
  }

  function paint(next,source='runtime'){
    next=normalize(next);
    if(state===next&&BODY.dataset.jarvisState===next)return;
    state=next;
    CLASSES.forEach(c=>BODY.classList.remove(c));
    const cls=CLASS_BY_STATE[next];if(cls)BODY.classList.add(cls);
    BODY.dataset.jarvisState=next;
    BODY.dataset.jarvisStateSource=source;
    const label=document.querySelector('.core .state');if(label)label.textContent=LABELS[next]||'EN LIGNE';
    const readout=document.querySelector('#stateReadout');if(readout)readout.textContent='État : '+(next==='idle'?'OPÉRATIONNEL':LABELS[next]);
    window.dispatchEvent(new CustomEvent('jarvis:state-applied',{detail:{state:next,source}}));
  }

  function setState(next,opts={}){
    clearTimeout(releaseTimer);
    paint(next,opts.source||'api');
    const hold=Number(opts.hold||0);
    if(hold>0)releaseTimer=setTimeout(()=>paint('idle','timeout'),hold);
  }

  window.jarvisSetState=setState;
  window.jarvisGetState=()=>state;

  ['jarvis:state','jarvis-state','jarvis_state'].forEach(name=>{
    window.addEventListener(name,e=>setState(e?.detail?.state??e?.detail??'idle',{source:name}));
    document.addEventListener(name,e=>setState(e?.detail?.state??e?.detail??'idle',{source:name}));
  });

  window.addEventListener('message',e=>{
    const d=e?.data;if(!d||typeof d!=='object')return;
    if(['jarvis-state','jarvis:state','jarvis_state'].includes(d.type))setState(d.state,{source:'postMessage'});
  });

  /* Browser TTS: make PAROLE follow the real utterance lifecycle. */
  try{
    const synth=window.speechSynthesis;
    if(synth&&typeof synth.speak==='function'&&!synth.__jarvisWrapped){
      const original=synth.speak.bind(synth);
      synth.speak=function(utterance){
        if(utterance&&typeof utterance==='object'){
          const userStart=utterance.onstart,userEnd=utterance.onend,userError=utterance.onerror,userPause=utterance.onpause,userResume=utterance.onresume;
          utterance.onstart=function(ev){setState('speaking',{source:'speechSynthesis'});if(typeof userStart==='function')userStart.call(this,ev)};
          utterance.onresume=function(ev){setState('speaking',{source:'speechSynthesis'});if(typeof userResume==='function')userResume.call(this,ev)};
          utterance.onpause=function(ev){setState('idle',{source:'speechSynthesis'});if(typeof userPause==='function')userPause.call(this,ev)};
          utterance.onend=function(ev){setState('idle',{source:'speechSynthesis'});if(typeof userEnd==='function')userEnd.call(this,ev)};
          utterance.onerror=function(ev){setState('idle',{source:'speechSynthesis'});if(typeof userError==='function')userError.call(this,ev)};
        }
        return original(utterance);
      };
      synth.__jarvisWrapped=true;
    }
  }catch(_e){}

  /* Audio-based TTS: catches HA/browser audio players as well. */
  const isAudio=el=>el&&String(el.tagName).toLowerCase()==='audio';
  document.addEventListener('play',e=>{if(!isAudio(e.target))return;mediaDepth++;setState('speaking',{source:'audio'})},true);
  document.addEventListener('playing',e=>{if(!isAudio(e.target))return;setState('speaking',{source:'audio'})},true);
  const releaseAudio=e=>{if(!isAudio(e.target))return;mediaDepth=Math.max(0,mediaDepth-1);if(mediaDepth===0)setState('idle',{source:'audio'})};
  document.addEventListener('ended',releaseAudio,true);
  document.addEventListener('pause',releaseAudio,true);
  document.addEventListener('error',releaseAudio,true);

  /* Optional data-state bridge for future HA/native integration. */
  const obs=new MutationObserver(()=>{
    const hinted=BODY.getAttribute('data-assistant-state')||document.documentElement.getAttribute('data-assistant-state');
    if(hinted)setState(hinted,{source:'data-assistant-state'});
  });
  obs.observe(BODY,{attributes:true,attributeFilter:['data-assistant-state']});
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-assistant-state']});

  /* Keep externally applied legacy classes reflected in the label/readout. */
  const classObs=new MutationObserver(()=>{
    if(BODY.classList.contains('jarvis-speaking')){state='speaking';BODY.dataset.jarvisState='speaking'}
    else if(BODY.classList.contains('jarvis-searching')){state='searching';BODY.dataset.jarvisState='searching'}
    else if(BODY.classList.contains('jarvis-thinking')){state='thinking';BODY.dataset.jarvisState='thinking'}
    else if(BODY.classList.contains('jarvis-listening')){state='listening';BODY.dataset.jarvisState='listening'}
    else if(!BODY.classList.contains('jarvis-booting')){state='idle';BODY.dataset.jarvisState='idle'}
  });
  classObs.observe(BODY,{attributes:true,attributeFilter:['class']});

  BODY.dataset.jarvisFinal='431';
})();

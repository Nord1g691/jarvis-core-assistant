(()=>{
  if(window.__jarvisBootPro)return;window.__jarvisBootPro=true;
  const body=document.body,core=document.querySelector('.core'),state=core?.querySelector('.state');if(!body||!core)return;
  const existing=document.querySelector('.jarvis-boot-hud');existing?.remove();
  const hud=document.createElement('div');hud.className='jarvis-boot-hud';hud.innerHTML=`<div class="jarvis-boot-console"><div class="jarvis-boot-line"><b id="jarvisBootStep">INITIALISATION DU CORE</b><span id="jarvisBootPct">00%</span></div><div class="jarvis-boot-progress"><i id="jarvisBootBar"></i></div><div class="jarvis-boot-grid"><span data-boot-module="core">CORE</span><span data-boot-module="led">LED 72</span><span data-boot-module="orbit">ORBITES</span><span data-boot-module="sentinel">SENTINEL</span></div></div>`;body.appendChild(hud);
  const step=hud.querySelector('#jarvisBootStep'),pct=hud.querySelector('#jarvisBootPct'),bar=hud.querySelector('#jarvisBootBar');
  const modules=[...hud.querySelectorAll('[data-boot-module]')];
  const phases=[
    {t:0,p:2,label:'NOYAU JARVIS',state:'INITIALISATION',mods:[]},
    {t:520,p:12,label:'ALIMENTATION DU NOYAU',state:'ALIMENTATION',mods:['core']},
    {t:1040,p:28,label:'MÉCANIQUE INTERNE',state:'CONSTRUCTION DU CORE',mods:['core']},
    {t:1620,p:46,label:'EXPANSION DES ANNEAUX',state:'CONSTRUCTION DU CORE',mods:['core']},
    {t:2220,p:64,label:'ALLUMAGE MATRICE · 72/72',state:'MATRICE 72/72',mods:['core','led']},
    {t:2820,p:79,label:'VERROUILLAGE DU CHÂSSIS',state:'CALIBRATION',mods:['core','led']},
    {t:3180,p:88,label:'SYNCHRONISATION ORBITALE',state:'SYNCHRONISATION',mods:['core','led','orbit']},
    {t:3720,p:96,label:'LIAISON SENTINEL · PIPELINE',state:'LIAISON SENTINEL',mods:['core','led','orbit','sentinel']},
    {t:4180,p:100,label:'SYSTÈME OPÉRATIONNEL',state:'EN LIGNE',mods:['core','led','orbit','sentinel']}
  ];
  const start=performance.now(),endAt=start+4480;let current=-1,watch=0,orbitPaused=false;
  body.classList.add('jarvis-booting');body.classList.remove('jarvis-boot-ready');
  function applyPhase(i){const ph=phases[i];if(!ph)return;current=i;step.textContent=ph.label;pct.textContent=String(ph.p).padStart(2,'0')+'%';bar.style.setProperty('--boot-progress',ph.p+'%');if(state)state.textContent=ph.state;modules.forEach(m=>m.classList.toggle('on',ph.mods.includes(m.dataset.bootModule)))}
  applyPhase(0);
  function frame(now){
    const elapsed=now-start;
    let idx=0;for(let i=0;i<phases.length;i++)if(elapsed>=phases[i].t)idx=i;if(idx!==current)applyPhase(idx);
    if(now<endAt&&!body.classList.contains('jarvis-booting'))body.classList.add('jarvis-booting');
    if(!orbitPaused&&window.jarvisOrbitPro?.pause){window.jarvisOrbitPro.pause(4700);orbitPaused=true}
    if(now<endAt){watch=requestAnimationFrame(frame);return}
    body.classList.remove('jarvis-booting');body.classList.add('jarvis-boot-ready');if(state)state.textContent='EN LIGNE';bar.style.setProperty('--boot-progress','100%');pct.textContent='100%';step.textContent='SYSTÈME OPÉRATIONNEL';
    setTimeout(()=>{hud.style.opacity='0';setTimeout(()=>hud.remove(),260)},250);setTimeout(()=>body.classList.remove('jarvis-boot-ready'),760)
  }
  watch=requestAnimationFrame(frame);
  window.jarvisRunCinematicBoot=()=>{cancelAnimationFrame(watch);hud.remove();window.__jarvisBootPro=false;location.reload()};
})();

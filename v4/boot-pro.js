(()=>{
  if(window.__jarvisBootPro)return;window.__jarvisBootPro=true;
  const body=document.body,core=document.querySelector('.core'),state=core?.querySelector('.state');if(!body||!core)return;
  const existing=document.querySelector('.jarvis-boot-hud');existing?.remove();
  const hud=document.createElement('div');hud.className='jarvis-boot-hud';hud.innerHTML=`<div class="jarvis-boot-console"><div class="jarvis-boot-line"><b id="jarvisBootStep">INITIALISATION DU CORE</b><span id="jarvisBootPct">00%</span></div><div class="jarvis-boot-progress"><i id="jarvisBootBar"></i></div><div class="jarvis-boot-grid"><span data-boot-module="core">CORE</span><span data-boot-module="led">LED 72</span><span data-boot-module="orbit">ORBITES</span><span data-boot-module="sentinel">SENTINEL</span></div></div>`;body.appendChild(hud);
  const step=hud.querySelector('#jarvisBootStep'),pct=hud.querySelector('#jarvisBootPct'),bar=hud.querySelector('#jarvisBootBar');
  const modules=[...hud.querySelectorAll('[data-boot-module]')];
  const phases=[
    {t:0,p:3,label:'INITIALISATION DU CORE',state:'INITIALISATION',mods:[]},
    {t:360,p:14,label:'ALIMENTATION DU NOYAU',state:'ALIMENTATION',mods:['core']},
    {t:760,p:31,label:'ASSEMBLAGE DES ANNEAUX',state:'CONSTRUCTION DU CORE',mods:['core']},
    {t:1160,p:51,label:'MATRICE LUMINEUSE · 72/72',state:'MATRICE 72/72',mods:['core','led']},
    {t:1640,p:68,label:'CALIBRATION DES COUCHES HUD',state:'CALIBRATION',mods:['core','led']},
    {t:2050,p:82,label:'SYNCHRONISATION ORBITALE',state:'SYNCHRONISATION',mods:['core','led','orbit']},
    {t:2540,p:93,label:'LIAISON SENTINEL · PIPELINE',state:'LIAISON SENTINEL',mods:['core','led','orbit','sentinel']},
    {t:3020,p:100,label:'SYSTÈME OPÉRATIONNEL',state:'EN LIGNE',mods:['core','led','orbit','sentinel']}
  ];
  const start=performance.now(),endAt=start+3400;let current=-1,watch=0,orbitPaused=false;
  body.classList.add('jarvis-booting');body.classList.remove('jarvis-boot-ready');
  function applyPhase(i){const ph=phases[i];if(!ph)return;current=i;step.textContent=ph.label;pct.textContent=String(ph.p).padStart(2,'0')+'%';bar.style.setProperty('--boot-progress',ph.p+'%');if(state)state.textContent=ph.state;modules.forEach(m=>m.classList.toggle('on',ph.mods.includes(m.dataset.bootModule)))}
  applyPhase(0);
  function frame(now){
    const elapsed=now-start;
    let idx=0;for(let i=0;i<phases.length;i++)if(elapsed>=phases[i].t)idx=i;if(idx!==current)applyPhase(idx);
    /* The legacy preview boot removes the class after ~2.1s; this cinematic sequence owns it until completion. */
    if(now<endAt&&!body.classList.contains('jarvis-booting'))body.classList.add('jarvis-booting');
    if(!orbitPaused&&window.jarvisOrbitPro?.pause){window.jarvisOrbitPro.pause(3600);orbitPaused=true}
    if(now<endAt){watch=requestAnimationFrame(frame);return}
    body.classList.remove('jarvis-booting');body.classList.add('jarvis-boot-ready');if(state)state.textContent='EN LIGNE';bar.style.setProperty('--boot-progress','100%');pct.textContent='100%';step.textContent='SYSTÈME OPÉRATIONNEL';
    setTimeout(()=>{hud.style.opacity='0';setTimeout(()=>hud.remove(),260)},260);setTimeout(()=>body.classList.remove('jarvis-boot-ready'),720)
  }
  watch=requestAnimationFrame(frame);
  window.jarvisRunCinematicBoot=()=>{cancelAnimationFrame(watch);hud.remove();window.__jarvisBootPro=false;location.reload()};
})();

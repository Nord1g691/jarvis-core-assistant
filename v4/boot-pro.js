(()=>{
  if(window.__jarvisBootPro)return;window.__jarvisBootPro=true;
  const body=document.body,core=document.querySelector('.core'),state=core?.querySelector('.state');if(!body||!core)return;
  const existing=document.querySelector('.jarvis-boot-hud');existing?.remove();
  const hud=document.createElement('div');hud.className='jarvis-boot-hud';hud.innerHTML=`<div class="jarvis-boot-console"><div class="jarvis-boot-line"><b id="jarvisBootStep">NOYAU JARVIS</b><span id="jarvisBootPct">00%</span></div><div class="jarvis-boot-progress"><i id="jarvisBootBar"></i></div><div class="jarvis-boot-grid"><span data-boot-module="core">CORE</span><span data-boot-module="color">COULEUR</span><span data-boot-module="led">LED 72</span><span data-boot-module="orbit">ORBITES</span></div></div>`;body.appendChild(hud);
  const step=hud.querySelector('#jarvisBootStep'),pct=hud.querySelector('#jarvisBootPct'),bar=hud.querySelector('#jarvisBootBar');
  const modules=[...hud.querySelectorAll('[data-boot-module]')];
  const phases=[
    {t:0,p:2,label:'NOYAU JARVIS',state:'INITIALISATION',mods:[]},
    {t:650,p:10,label:'STABILISATION DU NOYAU',state:'STABILISATION',mods:['core']},
    {t:1400,p:24,label:'MÉCANIQUE INTERNE',state:'CONSTRUCTION',mods:['core']},
    {t:2350,p:42,label:'ARCHITECTURE RADIALE',state:'CONSTRUCTION',mods:['core']},
    {t:3400,p:58,label:'CHÂSSIS VERROUILLÉ',state:'STRUCTURE OK',mods:['core']},
    {t:4000,p:68,label:'INJECTION CHROMATIQUE · NOYAU',state:'CHARGE COULEUR',mods:['core','color']},
    {t:4550,p:78,label:'PROPAGATION COULEUR · ANNEAUX',state:'CHARGE COULEUR',mods:['core','color']},
    {t:5150,p:88,label:'MATRICE LUMINEUSE · 72/72',state:'MATRICE 72/72',mods:['core','color','led']},
    {t:5750,p:92,label:'CONSTRUCTION DES ORBITES',state:'SYNCHRONISATION',mods:['core','color','led','orbit']},
    {t:6600,p:94,label:'ANCRAGE DES MODULES',state:'SYNCHRONISATION',mods:['core','color','led','orbit']},
    {t:7700,p:95,label:'IDENTITÉ JARVIS',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:8500,p:96,label:'LIAISON TEMPS RÉEL',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:9200,p:96,label:'TÉLÉMÉTRIE HUD',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:10000,p:97,label:'DIAGNOSTIC CORE',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:11800,p:98,label:'DONNÉES SYSTÈME',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:13000,p:98,label:'MODULES ÉNERGIE · MAISON',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:14100,p:99,label:'ASSISTANT JARVIS EN LIGNE',state:'FINALISATION',mods:['core','color','led','orbit']},
    {t:14800,p:99,label:'COMMANDES INTERFACE',state:'FINALISATION',mods:['core','color','led','orbit']},
    {t:15600,p:100,label:'SYSTÈME OPÉRATIONNEL',state:'EN LIGNE',mods:['core','color','led','orbit']}
  ];
  const start=performance.now(),endAt=start+16250;let current=-1,watch=0,orbitPaused=false;
  body.classList.add('jarvis-booting');body.classList.remove('jarvis-boot-ready');
  function applyPhase(i){const ph=phases[i];if(!ph)return;current=i;[...body.classList].filter(c=>c.startsWith('jarvis-boot-phase-')).forEach(c=>body.classList.remove(c));body.classList.add('jarvis-boot-phase-'+i);body.dataset.jarvisBootPhase=String(i);step.textContent=ph.label;pct.textContent=String(ph.p).padStart(2,'0')+'%';bar.style.setProperty('--boot-progress',ph.p+'%');if(state)state.textContent=ph.state;modules.forEach(m=>m.classList.toggle('on',ph.mods.includes(m.dataset.bootModule)))}
  applyPhase(0);
  function frame(now){
    const elapsed=now-start;let idx=0;for(let i=0;i<phases.length;i++)if(elapsed>=phases[i].t)idx=i;if(idx!==current)applyPhase(idx);
    if(now<endAt&&!body.classList.contains('jarvis-booting'))body.classList.add('jarvis-booting');
    if(!orbitPaused&&window.jarvisOrbitPro?.pause){window.jarvisOrbitPro.pause(16500);orbitPaused=true}
    if(now<endAt){watch=requestAnimationFrame(frame);return}
    body.classList.remove('jarvis-booting');body.classList.add('jarvis-boot-ready');[...body.classList].filter(c=>c.startsWith('jarvis-boot-phase-')).forEach(c=>body.classList.remove(c));delete body.dataset.jarvisBootPhase;
    if(state)state.textContent='EN LIGNE';bar.style.setProperty('--boot-progress','100%');pct.textContent='100%';step.textContent='SYSTÈME OPÉRATIONNEL';
    setTimeout(()=>{hud.style.opacity='0';setTimeout(()=>hud.remove(),300)},160);setTimeout(()=>body.classList.remove('jarvis-boot-ready'),950)
  }
  watch=requestAnimationFrame(frame);
  window.jarvisRunCinematicBoot=()=>{cancelAnimationFrame(watch);hud.remove();window.__jarvisBootPro=false;location.reload()};
})();
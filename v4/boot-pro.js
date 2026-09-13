(()=>{
  if(window.__jarvisBootPro)return;window.__jarvisBootPro=true;
  const body=document.body,core=document.querySelector('.core'),state=core?.querySelector('.state');if(!body||!core)return;

  const old=document.querySelector('.jarvis-boot-hud');old?.remove();
  const hud=document.createElement('div');hud.className='jarvis-boot-hud';hud.innerHTML=`<div class="jarvis-boot-console"><div class="jarvis-boot-line"><b id="jarvisBootStep">NOYAU JARVIS</b><span id="jarvisBootPct">02%</span></div><div class="jarvis-boot-progress"><i id="jarvisBootBar"></i></div><div class="jarvis-boot-grid"><span data-boot-module="core">CORE</span><span data-boot-module="color">COULEUR</span><span data-boot-module="led">LED 72</span><span data-boot-module="orbit">ORBITES</span></div></div>`;body.appendChild(hud);
  const step=hud.querySelector('#jarvisBootStep'),pct=hud.querySelector('#jarvisBootPct'),bar=hud.querySelector('#jarvisBootBar');
  const modules=[...hud.querySelectorAll('[data-boot-module]')];

  const phases=[
    {t:0,p:2,label:'NOYAU JARVIS',state:'INITIALISATION',mods:[]},
    {t:430,p:11,label:'DÉVERROUILLAGE MÉCANIQUE',state:'CONSTRUCTION',mods:['core']},
    {t:1050,p:24,label:'ASSEMBLAGE INTERNE',state:'CONSTRUCTION',mods:['core']},
    {t:1650,p:39,label:'STRUCTURE RADIALE',state:'CONSTRUCTION',mods:['core']},
    {t:2300,p:54,label:'ANNEAUX EXTÉRIEURS',state:'CONSTRUCTION',mods:['core']},
    {t:2950,p:67,label:'CHÂSSIS VERROUILLÉ',state:'STRUCTURE OK',mods:['core']},
    {t:3400,p:78,label:'MISE SOUS TENSION',state:'CHARGE COULEUR',mods:['core','color']},
    {t:3900,p:87,label:'MATRICE 72 LED',state:'MATRICE 72/72',mods:['core','color','led']},
    {t:4300,p:92,label:'TRACÉ DES ORBITES',state:'SYNCHRONISATION',mods:['core','color','led','orbit']},
    {t:4750,p:95,label:'ANCRAGE DES MODULES',state:'SYNCHRONISATION',mods:['core','color','led','orbit']},
    {t:5000,p:96,label:'IDENTITÉ JARVIS',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:5350,p:97,label:'LIAISON TEMPS RÉEL',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:5700,p:98,label:'TÉLÉMÉTRIE HUD',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:6050,p:98,label:'DIAGNOSTIC CORE',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:6350,p:99,label:'DONNÉES MAISON',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:6650,p:99,label:'COMMANDES JARVIS',state:'FINALISATION',mods:['core','color','led','orbit']},
    {t:6850,p:100,label:'STABILISATION',state:'EN LIGNE',mods:['core','color','led','orbit']}
  ];

  body.classList.remove('jarvis-boot-ready','jarvis-boot-settling');
  body.classList.add('jarvis-booting');
  /* Critical prepaint gate is removed only after boot CSS is loaded and the real Core exists. */
  body.classList.remove('jarvis-prepaint');

  const start=performance.now(),endAt=start+7000;let current=-1,raf=0,orbitPaused=false;
  const applyPhase=i=>{
    const ph=phases[i];if(!ph)return;current=i;
    [...body.classList].filter(c=>c.startsWith('jarvis-boot-phase-')).forEach(c=>body.classList.remove(c));
    body.classList.add('jarvis-boot-phase-'+i);body.dataset.jarvisBootPhase=String(i);
    body.classList.toggle('jarvis-boot-settling',i>=16);
    step.textContent=ph.label;pct.textContent=String(ph.p).padStart(2,'0')+'%';bar.style.setProperty('--boot-progress',ph.p+'%');
    if(state)state.textContent=ph.state;
    modules.forEach(m=>m.classList.toggle('on',ph.mods.includes(m.dataset.bootModule)));
  };
  applyPhase(0);

  const frame=now=>{
    const elapsed=now-start;let idx=0;for(let i=0;i<phases.length;i++)if(elapsed>=phases[i].t)idx=i;if(idx!==current)applyPhase(idx);
    if(!orbitPaused&&window.jarvisOrbitPro?.pause){window.jarvisOrbitPro.pause(7200);orbitPaused=true}
    if(now<endAt){raf=requestAnimationFrame(frame);return}
    body.classList.remove('jarvis-booting','jarvis-boot-settling','jarvis-prepaint');
    [...body.classList].filter(c=>c.startsWith('jarvis-boot-phase-')).forEach(c=>body.classList.remove(c));delete body.dataset.jarvisBootPhase;
    if(state)state.textContent='EN LIGNE';hud.remove();
  };
  raf=requestAnimationFrame(frame);

  window.jarvisRunCinematicBoot=()=>{cancelAnimationFrame(raf);hud.remove();body.classList.remove('jarvis-booting','jarvis-boot-settling','jarvis-prepaint');window.__jarvisBootPro=false;location.reload()};
})();
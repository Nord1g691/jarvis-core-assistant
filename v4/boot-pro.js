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
    {t:2300,p:53,label:'ANNEAUX STRUCTURELS',state:'CONSTRUCTION',mods:['core']},
    {t:2950,p:64,label:'CHÂSSIS EXTERNE',state:'CONSTRUCTION',mods:['core']},
    {t:3450,p:73,label:'VERROUILLAGE PÉRIPHÉRIQUE',state:'CONSTRUCTION',mods:['core']},
    {t:3950,p:81,label:'MICRO-MÉCANIQUE',state:'CONSTRUCTION',mods:['core']},
    {t:4400,p:87,label:'MISE SOUS TENSION',state:'CHARGE COULEUR',mods:['core','color']},
    {t:4850,p:92,label:'MATRICE 72 LED',state:'MATRICE 72/72',mods:['core','color','led']},
    {t:5200,p:95,label:'TRACÉ DES ORBITES',state:'SYNCHRONISATION',mods:['core','color','led','orbit']},
    {t:5500,p:96,label:'INTÉGRATION DU CORE',state:'ASSEMBLAGE FINAL',mods:['core','color','led','orbit']},
    {t:5750,p:97,label:'MÉCANIQUE INTERNE',state:'ASSEMBLAGE FINAL',mods:['core','color','led','orbit']},
    {t:6000,p:98,label:'CHÂSSIS FINAL',state:'ASSEMBLAGE FINAL',mods:['core','color','led','orbit']},
    {t:6250,p:99,label:'DÉTAILS TECHNIQUES',state:'ASSEMBLAGE INTERFACE',mods:['core','color','led','orbit']},
    {t:6500,p:99,label:'INTERFACE JARVIS',state:'FINALISATION',mods:['core','color','led','orbit']},
    {t:6800,p:100,label:'STABILISATION',state:'EN LIGNE',mods:['core','color','led','orbit']}
  ];

  body.classList.remove('jarvis-boot-ready','jarvis-boot-settling','jarvis-native-handoff');
  body.classList.add('jarvis-booting');
  body.classList.remove('jarvis-prepaint');

  const start=performance.now(),endAt=start+7000;let current=-1,raf=0,orbitPaused=false;
  const applyPhase=i=>{
    const ph=phases[i];if(!ph)return;current=i;
    [...body.classList].filter(c=>c.startsWith('jarvis-boot-phase-')).forEach(c=>body.classList.remove(c));
    body.classList.add('jarvis-boot-phase-'+i);body.dataset.jarvisBootPhase=String(i);
    body.classList.toggle('jarvis-native-handoff',i>=11);
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
    body.classList.remove('jarvis-booting','jarvis-boot-settling','jarvis-prepaint','jarvis-native-handoff');
    [...body.classList].filter(c=>c.startsWith('jarvis-boot-phase-')).forEach(c=>body.classList.remove(c));delete body.dataset.jarvisBootPhase;
    if(state)state.textContent='EN LIGNE';hud.remove();
  };
  raf=requestAnimationFrame(frame);

  window.jarvisRunCinematicBoot=()=>{cancelAnimationFrame(raf);hud.remove();body.classList.remove('jarvis-booting','jarvis-boot-settling','jarvis-prepaint','jarvis-native-handoff');window.__jarvisBootPro=false;location.reload()};
})();
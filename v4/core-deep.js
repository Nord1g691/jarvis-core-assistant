(()=>{
  const core=document.querySelector('.core');
  if(core&&!core.querySelector('.reactor-depth')){
    const host=document.createDocumentFragment();
    ['reactor-pulse','reactor-depth','reactor-grid','reactor-segments','reactor-scale','reactor-axis','reactor-crown','reactor-radials','reactor-lock','reactor-hub','reactor-glass'].forEach(c=>{
      const el=document.createElement('div');el.className=c;
      if(c==='reactor-scale'){for(let i=0;i<36;i++){const t=document.createElement('i');t.style.transform=`rotate(${i*10}deg) translateY(-50%)`;el.appendChild(t)}}
      if(c==='reactor-segments'){for(let i=0;i<12;i++){const s=document.createElement('i');s.style.setProperty('--i',i);el.appendChild(s)}}
      if(c==='reactor-axis'){for(let i=0;i<4;i++){const a=document.createElement('i');a.style.transform=`rotate(${i*45}deg)`;el.appendChild(a)}}
      if(c==='reactor-radials'){for(let i=0;i<16;i++){const r=document.createElement('i');r.style.transform=`rotate(${i*22.5}deg)`;el.appendChild(r)}}
      if(c==='reactor-lock'){for(let i=0;i<8;i++){const h=document.createElement('i');h.style.setProperty('--i',i);el.appendChild(h)}}
      host.appendChild(el)
    });
    const art=core.querySelector('.core-art');if(art)core.insertBefore(host,art);else core.appendChild(host)
  }

  /* Dedicated fabrication model: it is not the finished Core being faded in.
     It is a temporary mechanical assembly made from independent pieces at the
     exact final Core coordinates, then it hands off to the real Core. */
  if(core&&!core.querySelector('.jarvis-fabrication')){
    const fab=document.createElement('div');fab.className='jarvis-fabrication';fab.setAttribute('aria-hidden','true');
    fab.innerHTML='<div class="fab-wave"></div><div class="fab-seed"></div><div class="fab-lock"></div><div class="fab-spokes"></div><div class="fab-rings"><i class="fr1"></i><i class="fr2"></i><i class="fr3"></i><i class="fr4"></i><i class="fr5"></i><i class="fr6"></i></div><div class="fab-arcs"></div><div class="fab-led"></div><div class="fab-scan"></div>';
    const lock=fab.querySelector('.fab-lock');
    for(let i=0;i<8;i++){const h=document.createElement('i');h.style.setProperty('--pair',Math.floor(i/2));lock.appendChild(h)}
    const spokes=fab.querySelector('.fab-spokes');
    for(let i=0;i<16;i++){const s=document.createElement('i');s.style.setProperty('--i',i);spokes.appendChild(s)}
    const arcs=fab.querySelector('.fab-arcs');
    for(let i=0;i<12;i++){const a=document.createElement('i');a.style.setProperty('--i',i);arcs.appendChild(a)}
    const leds=fab.querySelector('.fab-led');
    for(let i=0;i<72;i++){
      const d=document.createElement('i'),deg=-90+i*5,rad=deg*Math.PI/180,r=47.1;
      d.style.left=(50+r*Math.cos(rad))+'%';d.style.top=(50+r*Math.sin(rad))+'%';d.style.transform=`translate(-50%,-50%) rotate(${deg+90}deg)`;d.style.setProperty('--i',i);leds.appendChild(d)
    }
    core.appendChild(fab)
  }

  const addCss=(href,key)=>{
    const found=document.querySelector(`link[data-jarvis-${key}]`);if(found)return found;
    const x=document.createElement('link');x.rel='stylesheet';x.href=href;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='451';document.head.appendChild(x);return x
  };
  const addJs=(src,key)=>{
    if(document.querySelector(`script[data-jarvis-${key}]`))return;
    const x=document.createElement('script');x.src=src;x.async=false;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='451';document.head.appendChild(x)
  };

  addCss('final-pass.css?v=451','final');
  addCss('final-pulse.css?v=451','pulse');
  addCss('orbit-pro.css?v=451','orbit');
  addCss('orbit-hotfix.css?v=451','orbithotfix');
  addCss('state-tuning.css?v=451','statetuning');
  addJs('final-runtime.js?v=451','final');
  addJs('orbit-pro.js?v=451','orbit');

  const boot=addCss('boot-master.css?v=451','bootmaster');
  const fabrication=addCss('boot-fabrication.css?v=451','bootfabrication');
  let started=false;
  const startBoot=()=>{if(started)return;started=true;addJs('boot-pro.js?v=451','boot')};
  const ready=link=>new Promise(resolve=>{
    if(link.sheet){resolve();return}
    const done=()=>resolve();link.addEventListener('load',done,{once:true});link.addEventListener('error',done,{once:true})
  });
  Promise.all([ready(boot),ready(fabrication)]).then(()=>requestAnimationFrame(startBoot));
  setTimeout(startBoot,1000);
})();
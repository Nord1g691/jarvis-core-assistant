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

  if(core&&!core.querySelector('.jarvis-fabrication')){
    const fab=document.createElement('div');fab.className='jarvis-fabrication';fab.setAttribute('aria-hidden','true');
    fab.innerHTML='<div class="fab-wave"></div><div class="fab-seed"></div><div class="fab-lock"></div><div class="fab-spokes"></div><div class="fab-rings"><i class="fr1"></i><i class="fr2"></i><i class="fr3"></i><i class="fr4"></i><i class="fr5"></i><i class="fr6"></i></div><div class="fab-arcs"></div><div class="fab-braces"></div><div class="fab-marks"></div><div class="fab-nodes"></div><div class="fab-powerwave"></div><div class="fab-led"></div><div class="fab-scan"></div>';

    const lock=fab.querySelector('.fab-lock');
    const lockRot=[-18,18,-7,7,7,-7,18,-18];
    for(let i=0;i<8;i++){
      const h=document.createElement('i');
      h.style.setProperty('--d',(0.44+Math.floor(i/2)*0.18).toFixed(2)+'s');
      h.style.setProperty('--rot',lockRot[i]+'deg');
      lock.appendChild(h)
    }

    const spokes=fab.querySelector('.fab-spokes');
    for(let i=0;i<16;i++){
      const s=document.createElement('i');
      s.style.setProperty('--d',(0.82+i*0.032).toFixed(3)+'s');
      s.style.setProperty('--rot',(i*22.5)+'deg');
      spokes.appendChild(s)
    }

    const arcs=fab.querySelector('.fab-arcs');
    for(let i=0;i<12;i++){
      const a=document.createElement('i');
      a.style.setProperty('--d',(1.70+i*0.105).toFixed(3)+'s');
      a.style.setProperty('--rot',(i*30)+'deg');
      arcs.appendChild(a)
    }

    const braces=fab.querySelector('.fab-braces');
    for(let i=0;i<8;i++){
      const b=document.createElement('i');
      b.style.setProperty('--rot',(i*45-22.5)+'deg');
      b.style.setProperty('--d',(2.94+i*0.085).toFixed(3)+'s');
      braces.appendChild(b)
    }

    const marks=fab.querySelector('.fab-marks');
    for(let i=0;i<24;i++){
      const m=document.createElement('i'),deg=-90+i*15,rad=deg*Math.PI/180,r=43.4;
      m.style.left=(50+r*Math.cos(rad))+'%';
      m.style.top=(50+r*Math.sin(rad))+'%';
      m.style.transform=`translate(-50%,-50%) rotate(${deg+90}deg)`;
      m.style.setProperty('--d',(3.28+i*0.026).toFixed(3)+'s');
      marks.appendChild(m)
    }

    const nodes=fab.querySelector('.fab-nodes');
    for(let i=0;i<8;i++){
      const n=document.createElement('i'),deg=-90+i*45,rad=deg*Math.PI/180,r=37.4;
      n.style.left=(50+r*Math.cos(rad))+'%';
      n.style.top=(50+r*Math.sin(rad))+'%';
      n.style.setProperty('--d',(3.72+i*0.062).toFixed(3)+'s');
      nodes.appendChild(n)
    }

    const leds=fab.querySelector('.fab-led');
    for(let i=0;i<72;i++){
      const d=document.createElement('i'),deg=-90+i*5,rad=deg*Math.PI/180,r=47.1;
      d.style.left=(50+r*Math.cos(rad))+'%';
      d.style.top=(50+r*Math.sin(rad))+'%';
      d.style.transform=`translate(-50%,-50%) rotate(${deg+90}deg)`;
      d.style.setProperty('--d',(4.68+i*0.0095).toFixed(3)+'s');
      leds.appendChild(d)
    }
    core.appendChild(fab)
  }

  const addCss=(href,key)=>{
    const found=document.querySelector(`link[data-jarvis-${key}]`);if(found)return found;
    const x=document.createElement('link');x.rel='stylesheet';x.href=href;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='454';document.head.appendChild(x);return x
  };
  const addJs=(src,key)=>{
    if(document.querySelector(`script[data-jarvis-${key}]`))return;
    const x=document.createElement('script');x.src=src;x.async=false;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='454';document.head.appendChild(x)
  };

  addCss('final-pass.css?v=454','final');
  addCss('final-pulse.css?v=454','pulse');
  addCss('orbit-pro.css?v=454','orbit');
  addCss('orbit-hotfix.css?v=454','orbithotfix');
  addCss('state-tuning.css?v=454','statetuning');
  addJs('final-runtime.js?v=454','final');
  addJs('orbit-pro.js?v=454','orbit');

  const boot=addCss('boot-master.css?v=454','bootmaster');
  const fabrication=addCss('boot-fabrication.css?v=454','bootfabrication');
  const fabricationFix=addCss('boot-fabrication-fix.css?v=454','bootfabricationfix');
  const finalContinuation=addCss('boot-final-continuous.css?v=454','bootfinalcontinuous');
  const singleMachine=addCss('boot-single-machine.css?v=454','bootsinglemachine');
  const after3=addCss('boot-after3.css?v=454','bootafter3');
  let started=false;
  const startBoot=()=>{if(started)return;started=true;addJs('boot-pro.js?v=454','boot')};
  const ready=link=>new Promise(resolve=>{
    if(link.sheet){resolve();return}
    const done=()=>resolve();link.addEventListener('load',done,{once:true});link.addEventListener('error',done,{once:true})
  });
  Promise.all([ready(boot),ready(fabrication),ready(fabricationFix),ready(finalContinuation),ready(singleMachine),ready(after3)]).then(()=>requestAnimationFrame(startBoot));
  setTimeout(startBoot,1400);
})();
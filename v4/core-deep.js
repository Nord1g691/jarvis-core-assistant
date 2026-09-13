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

  const addCss=(href,key)=>{
    const found=document.querySelector(`link[data-jarvis-${key}]`);if(found)return found;
    const x=document.createElement('link');x.rel='stylesheet';x.href=href;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='450';document.head.appendChild(x);return x
  };
  const addJs=(src,key)=>{
    if(document.querySelector(`script[data-jarvis-${key}]`))return;
    const x=document.createElement('script');x.src=src;x.async=false;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='450';document.head.appendChild(x)
  };

  addCss('final-pass.css?v=450','final');
  addCss('final-pulse.css?v=450','pulse');
  addCss('orbit-pro.css?v=450','orbit');
  addCss('orbit-hotfix.css?v=450','orbithotfix');
  addCss('state-tuning.css?v=450','statetuning');
  addJs('final-runtime.js?v=450','final');
  addJs('orbit-pro.js?v=450','orbit');

  /* Boot is intentionally a single stylesheet now. Do not start the clock until it is ready. */
  const boot=addCss('boot-master.css?v=450','bootmaster');
  let started=false;
  const startBoot=()=>{if(started)return;started=true;addJs('boot-pro.js?v=450','boot')};
  if(boot.sheet)requestAnimationFrame(startBoot);
  else boot.addEventListener('load',startBoot,{once:true});
  boot.addEventListener('error',startBoot,{once:true});
  setTimeout(startBoot,700);
})();
(()=>{
  const core=document.querySelector('.core');
  if(core&&!core.querySelector('.reactor-depth')){
    const host=document.createDocumentFragment();
    ['reactor-pulse','reactor-depth','reactor-grid','reactor-segments','reactor-scale','reactor-axis','reactor-crown','reactor-radials','reactor-hub','reactor-glass'].forEach(c=>{
      const el=document.createElement('div');el.className=c;
      if(c==='reactor-scale'){for(let i=0;i<36;i++){const t=document.createElement('i');t.style.transform=`rotate(${i*10}deg) translateY(-50%)`;el.appendChild(t)}}
      if(c==='reactor-segments'){for(let i=0;i<12;i++){const s=document.createElement('i');s.style.setProperty('--i',i);el.appendChild(s)}}
      if(c==='reactor-axis'){for(let i=0;i<4;i++){const a=document.createElement('i');a.style.transform=`rotate(${i*45}deg)`;el.appendChild(a)}}
      if(c==='reactor-radials'){for(let i=0;i<16;i++){const r=document.createElement('i');r.style.transform=`rotate(${i*22.5}deg)`;el.appendChild(r)}}
      host.appendChild(el)
    });
    const art=core.querySelector('.core-art');if(art)core.insertBefore(host,art);else core.appendChild(host)
  }
  const addCss=(href,key)=>{if(document.querySelector(`link[data-jarvis-${key}]`))return;const x=document.createElement('link');x.rel='stylesheet';x.href=href;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='441';document.head.appendChild(x)};
  const addJs=(src,key)=>{if(document.querySelector(`script[data-jarvis-${key}]`))return;const x=document.createElement('script');x.src=src;x.defer=true;x.dataset[`jarvis${key[0].toUpperCase()+key.slice(1)}`]='441';document.head.appendChild(x)};
  addCss('final-pass.css?v=441','final');
  addCss('final-pulse.css?v=441','pulse');
  addCss('orbit-pro.css?v=441','orbit');
  addCss('orbit-hotfix.css?v=441','orbithotfix');
  addCss('boot-pro.css?v=441','boot');
  addCss('boot-origin.css?v=441','bootorigin');
  addCss('boot-flow.css?v=441','bootflow');
  addJs('final-runtime.js?v=441','final');
  addJs('orbit-pro.js?v=441','orbit');
  addJs('boot-pro.js?v=441','boot');
})();
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

  /* Final V4.1 overrides are loaded here so the preview and the future native shell share one state contract. */
  if(!document.querySelector('link[data-jarvis-final]')){
    const css=document.createElement('link');css.rel='stylesheet';css.href='final-pass.css?v=431';css.dataset.jarvisFinal='431';document.head.appendChild(css)
  }
  if(!document.querySelector('script[data-jarvis-final]')){
    const js=document.createElement('script');js.src='final-runtime.js?v=431';js.defer=true;js.dataset.jarvisFinal='431';document.head.appendChild(js)
  }
})();
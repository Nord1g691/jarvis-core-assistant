(()=>{
  if(window.__jarvisOrbitPro)return;window.__jarvisOrbitPro=true;
  const frame=document.querySelector('.hudframe'),core=frame?.querySelector('.core');if(!frame||!core)return;
  const stage=document.createElement('div');stage.className='jarvis-orbit-stage';stage.setAttribute('aria-hidden','false');frame.appendChild(stage);
  let phase=-90,last=performance.now(),pauseUntil=0,raf=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');

  function adopt(){
    document.querySelectorAll('.orbit-card').forEach(card=>{if(card.parentElement!==stage)stage.appendChild(card)});
    const note=document.querySelector('.landscape-note');if(note)note.textContent='Les cartes sélectionnées orbitent autour du Core. Elles restent droites et accélèrent légèrement selon l’état JARVIS.';
  }
  function visibleCards(){
    return [...stage.querySelectorAll('.orbit-card')].filter(el=>!el.classList.contains('off')&&getComputedStyle(el).display!=='none').sort((a,b)=>(Number(a.dataset.slot)||99)-(Number(b.dataset.slot)||99));
  }
  function stateSpeed(){
    if(reduce.matches)return 0;
    const motion=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--jarvis-motion'))||1;
    let seconds=76;
    if(document.body.classList.contains('jarvis-listening'))seconds=52;
    if(document.body.classList.contains('jarvis-thinking'))seconds=42;
    if(document.body.classList.contains('jarvis-searching'))seconds=34;
    if(document.body.classList.contains('jarvis-speaking'))seconds=29;
    return 360/(seconds*1000)*motion;
  }
  function geometry(cards){
    const fr=frame.getBoundingClientRect(),cr=core.getBoundingClientRect();
    const landscape=innerWidth>innerHeight;
    const sample=cards[0]?.getBoundingClientRect();
    const cw=sample?.width||100,ch=sample?.height||56;
    const cx=cr.left-fr.left+cr.width/2,cy=cr.top-fr.top+cr.height/2;
    let rx,ry;
    if(landscape){
      rx=Math.min(Math.max(cr.width*.72,220),Math.max(220,fr.width/2-cw/2-20));
      ry=Math.min(cr.height*.47,Math.max(92,fr.height/2-ch/2-14));
    }else{
      rx=Math.min(cr.width*.48,Math.max(132,fr.width/2-cw/2-7));
      ry=cr.height*.46;
    }
    return{cx,cy,rx,ry,landscape};
  }
  function layout(){
    adopt();const all=visibleCards();const max=innerWidth>innerHeight?9:8;
    all.forEach((c,i)=>c.classList.toggle('orbit-overflow',i>=max));
    const cards=all.slice(0,max);if(!cards.length)return;
    const g=geometry(cards),step=360/cards.length;
    stage.style.setProperty('--orbit-cx',g.cx+'px');stage.style.setProperty('--orbit-cy',g.cy+'px');stage.style.setProperty('--orbit-rx',g.rx+'px');stage.style.setProperty('--orbit-ry',g.ry+'px');stage.style.setProperty('--orbit-phase',phase+'deg');
    cards.forEach((card,i)=>{
      const a=(phase+i*step)*Math.PI/180;
      const x=g.cx+Math.cos(a)*g.rx,y=g.cy+Math.sin(a)*g.ry;
      card.style.setProperty('--card-x',x+'px');card.style.setProperty('--card-y',y+'px');card.dataset.orbitIndex=String(i);
      const depth=(Math.sin(a)+1)/2;card.style.zIndex=String(12+Math.round(depth*3));card.style.opacity=String(.82+depth*.18);
    });
  }
  function tick(now){
    const dt=Math.min(40,now-last);last=now;
    if(now>pauseUntil)phase=(phase+dt*stateSpeed())%360;
    layout();raf=requestAnimationFrame(tick);
  }
  function pause(ms=3500){pauseUntil=performance.now()+ms}
  stage.addEventListener('pointerdown',()=>pause(4200),{passive:true});stage.addEventListener('focusin',()=>pause(5000));
  addEventListener('resize',()=>{pause(500);layout()});addEventListener('orientationchange',()=>setTimeout(()=>{pause(700);layout()},160));
  document.addEventListener('visibilitychange',()=>{last=performance.now()});
  const mo=new MutationObserver(()=>requestAnimationFrame(layout));mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-slot']});
  adopt();layout();raf=requestAnimationFrame(tick);
  window.jarvisOrbitPro={layout,pause,get phase(){return phase}};
})();

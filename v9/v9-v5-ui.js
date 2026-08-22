/** JARVIS V9 -> V5 additive UI layer. Never replaces the existing HUD. */
(() => {
  'use strict';
  const boot = () => {
    if (window.JARVIS_V9_V5_UI) return;
    const hud = window.JARVIS_V9_HUD;
    const runtime = window.JARVIS_V9_RUNTIME;
    if (!hud || !runtime) return;

    const css = document.createElement('style');
    css.dataset.jarvisV9Ui = '1';
    css.textContent = `
      #jv9MenuBtn{position:fixed;right:14px;bottom:max(14px,env(safe-area-inset-bottom));z-index:12000;width:48px;height:48px;border-radius:50%;border:1px solid rgba(0,234,255,.55);background:rgba(2,12,23,.9);color:#d9faff;box-shadow:0 0 18px rgba(0,234,255,.28),inset 0 0 15px rgba(0,234,255,.08);font:700 20px Rajdhani,sans-serif;backdrop-filter:blur(10px)}
      #jv9MenuBtn:active{transform:scale(.93)}
      #jv9Drawer{position:fixed;right:12px;bottom:74px;z-index:11999;width:min(420px,calc(100vw - 24px));max-height:calc(100dvh - 96px);overflow:auto;display:none;padding:12px;border:1px solid rgba(0,234,255,.32);border-radius:12px;background:rgba(2,10,20,.96);box-shadow:0 20px 70px rgba(0,0,0,.65),0 0 30px rgba(0,160,255,.08);backdrop-filter:blur(18px)}
      #jv9Drawer.open{display:block;animation:jv9In .18s ease both}
      .jv9Head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font:700 11px Orbitron,sans-serif;letter-spacing:2px;color:#9eeeff}.jv9Head button{border:0;background:none;color:#8fdff0;font-size:18px}
      .jv9Grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.jv9Cat{min-height:42px;text-align:left;padding:8px;border:1px solid rgba(0,200,255,.2);border-radius:7px;background:rgba(0,100,160,.08);color:#d9faff}.jv9Cat b{display:block;font:700 10px Rajdhani,sans-serif;letter-spacing:1.2px}.jv9Cat span{font-size:9px;opacity:.6}.jv9View{display:none;margin-top:9px;border-top:1px solid rgba(0,220,255,.14);padding-top:9px}.jv9View.open{display:block}.jv9Entity{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid rgba(0,220,255,.08)}.jv9Entity:last-child{border-bottom:0}.jv9Entity strong{font:600 11px Rajdhani,sans-serif}.jv9State{font-size:9px;opacity:.65}.jv9Actions{display:flex;gap:5px}.jv9Actions button{min-width:34px;height:30px;padding:0 7px;border-radius:5px;border:1px solid rgba(0,220,255,.25);background:rgba(0,130,190,.08);color:#d9faff}.jv9Foot{margin-top:9px;font-size:9px;opacity:.55;display:flex;justify-content:space-between;align-items:center}.jv9Conn{color:#7dffb2}.jv9Err{color:#ff8298}@keyframes jv9In{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
      @media(max-width:520px){#jv9Drawer{right:8px;bottom:68px;width:calc(100vw - 16px)}.jv9Grid{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(css);

    const btn = document.createElement('button'); btn.id='jv9MenuBtn'; btn.type='button'; btn.setAttribute('aria-label','Menu JARVIS V9'); btn.textContent='☰';
    const drawer = document.createElement('section'); drawer.id='jv9Drawer'; drawer.setAttribute('aria-label','Menu JARVIS V9');
    drawer.innerHTML='<div class="jv9Head"><span>JARVIS V9</span><button type="button" id="jv9Close" aria-label="Fermer">×</button></div><div class="jv9Grid" id="jv9Cats"></div><div class="jv9View" id="jv9View"></div><div class="jv9Foot"><span id="jv9Status">V9 — PRÊT</span><button type="button" id="jv9Refresh">↻</button></div>';
    document.body.append(btn,drawer);

    const cats = document.getElementById('jv9Cats'), view = document.getElementById('jv9View'), status = document.getElementById('jv9Status');
    let active = null;
    const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const label = e => e?.attributes?.friendly_name || e?.entity_id || 'Entité';
    const domain = e => String(e?.entity_id||'').split('.')[0];
    const service = (d, s, e) => runtime.callService(d,s,{}, {entity_id:e.entity_id});
    const actionButtons = e => {
      const d=domain(e);
      if(['light','switch','fan','input_boolean','group'].includes(d)) return '<button data-a="toggle">ON/OFF</button>';
      if(d==='cover') return '<button data-a="open_cover">OPEN</button><button data-a="close_cover">CLOSE</button>';
      if(d==='media_player') return '<button data-a="media_play_pause">▶/Ⅱ</button>';
      return '';
    };
    function renderCats(){
      const list = runtime.getCategories?.() || [];
      cats.innerHTML=list.map(c=>`<button class="jv9Cat" data-c="${esc(c.id)}"><b>${esc(c.icon||'•')} ${esc(c.label||c.id)}</b><span>${c.count||0} entités</span></button>`).join('');
    }
    function renderView(){
      if(!active){view.classList.remove('open');view.innerHTML='';return}
      const c=(runtime.getCategories?.()||[]).find(x=>x.id===active);
      const entities=c?.entities||[];
      view.classList.add('open');
      view.innerHTML=entities.length?`<div class="jv9Head"><span>${esc(c.label||active)}</span><button type="button" id="jv9Back">×</button></div>`+entities.slice(0,80).map(e=>`<div class="jv9Entity"><div><strong>${esc(label(e))}</strong><div class="jv9State">${esc(e.state)}</div></div><div class="jv9Actions">${actionButtons(e)}</div></div>`).join(''):'<div class="jv9State">Aucune entité détectée.</div>';
      view.querySelector('#jv9Back')?.addEventListener('click',()=>{active=null;renderView()});
      view.querySelectorAll('[data-a]').forEach((b,i)=>b.addEventListener('click',async()=>{
        const e=entities[i]; const a=b.dataset.a; b.disabled=true;
        try{
          if(a==='toggle') await service(domain(e),'toggle',e);
          else await service(domain(e),a,e);
          status.textContent='✓ ACTION ENVOYÉE'; await runtime.refreshEntities(); renderView();
        }catch(err){status.textContent='✗ '+err.message}
        finally{b.disabled=false}
      }));
    }
    cats.addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;active=b.dataset.c;renderView()});
    btn.addEventListener('click',()=>drawer.classList.toggle('open'));
    document.getElementById('jv9Close').addEventListener('click',()=>drawer.classList.remove('open'));
    document.getElementById('jv9Refresh').addEventListener('click',async()=>{try{await runtime.refreshEntities();renderCats();renderView();status.textContent='✓ ACTUALISÉ'}catch(e){status.textContent='✗ '+e.message}});
    window.addEventListener('jarvis:v9:entities',()=>{renderCats();if(active)renderView();status.textContent='V9 — CONNECTÉ'});
    window.addEventListener('jarvis:v9:error',e=>{status.textContent='✗ V9 — '+(e.detail?.message||'ERREUR')});
    renderCats();
    window.JARVIS_V9_V5_UI=Object.freeze({open:()=>drawer.classList.add('open'),close:()=>drawer.classList.remove('open'),refresh:()=>runtime.refreshEntities()});
    try{runtime.refreshEntities().catch(()=>{})}catch(_){ }
  };
  const wait = () => {
    if(window.JARVIS_V9_HUD && window.JARVIS_V9_RUNTIME) boot();
    else window.addEventListener('jarvis:v9-hud-ready',boot,{once:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wait,{once:true}); else wait();
})();

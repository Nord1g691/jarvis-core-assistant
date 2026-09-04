/** Draft JARVIS spatial house drawer. Safe, additive and removable. */
(()=>{'use strict';
  if(window.JARVIS_SPATIAL_UI)return;window.JARVIS_SPATIAL_UI=true;

  const waitNative=async()=>{
    if(window.JARVIS_HA_REQUEST)return true;
    await new Promise(resolve=>window.addEventListener('jarvis:ha-native-ready',resolve,{once:true}));
    return Boolean(window.JARVIS_HA_REQUEST);
  };

  const request=async(message)=>{await waitNative();return window.JARVIS_HA_REQUEST(message);};
  const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const serviceFor=(entityId)=>{
    const domain=String(entityId||'').split('.')[0];
    if(domain==='light'||domain==='switch')return [domain,'toggle'];
    if(domain==='cover')return ['cover','toggle'];
    return null;
  };

  const style=document.createElement('style');
  style.id='jarvis-spatial-style';
  style.textContent=`
    #jarvis-spatial-trigger{position:fixed;right:18px;bottom:18px;z-index:2147483000;border:1px solid #2c6f92;background:#071d2b;color:#dff7ff;border-radius:999px;padding:10px 14px;font:600 13px system-ui;box-shadow:0 12px 30px #0009;cursor:pointer}
    #jarvis-spatial-drawer{position:fixed;right:18px;bottom:68px;z-index:2147482999;width:min(390px,calc(100vw - 24px));max-height:min(70vh,720px);overflow:auto;background:#07131dee;border:1px solid #244b61;border-radius:16px;box-shadow:0 24px 60px #000b;color:#eaf7ff;font:13px system-ui;backdrop-filter:blur(16px);display:none}
    #jarvis-spatial-drawer.open{display:block}
    .jsp-head{padding:14px 15px;border-bottom:1px solid #1e3a4a;position:sticky;top:0;background:#07131df5;z-index:2}.jsp-title{font-size:16px;font-weight:750}.jsp-sub{font-size:11px;color:#86a9bc;margin-top:3px}
    .jsp-zone{padding:11px 13px;border-bottom:1px solid #142b38}.jsp-zone button.jsp-zone-open{all:unset;display:block;width:100%;cursor:pointer}.jsp-label{font-weight:700}.jsp-summary{font-size:11px;color:#93aebe;margin-top:4px;line-height:1.4}.jsp-meta{font-size:10px;color:#6fa2bc;margin-top:6px}
    .jsp-entities{display:none;padding-top:8px}.jsp-zone.expanded .jsp-entities{display:block}.jsp-entity{display:flex;align-items:center;gap:7px;padding:7px 8px;border:1px solid #1d4054;border-radius:8px;margin:5px 0;background:#0a1c27}.jsp-id{font:10px ui-monospace,monospace;overflow-wrap:anywhere;flex:1;color:#b8e8ff}.jsp-action{border:1px solid #2e6c8f;background:#0b2c3e;color:#e7f8ff;border-radius:7px;padding:5px 7px;cursor:pointer;font-size:10px}.jsp-status{padding:12px 14px;color:#8db3c6;font-size:11px}.jsp-error{color:#ffb5b5}
  `;
  document.head.appendChild(style);

  const trigger=document.createElement('button');
  trigger.id='jarvis-spatial-trigger';trigger.textContent='⌂ Maison';
  const drawer=document.createElement('section');drawer.id='jarvis-spatial-drawer';
  drawer.innerHTML='<div class="jsp-head"><div class="jsp-title">Maison</div><div class="jsp-sub">Chargement du modèle spatial…</div></div><div class="jsp-status">Connexion au JARVIS Core…</div>';
  document.body.append(trigger,drawer);

  let model=null;
  const render=()=>{
    if(!model)return;
    const zones=Array.isArray(model.zones)?model.zones:[];
    drawer.innerHTML=`<div class="jsp-head"><div class="jsp-title">Maison • ${esc(model.version||'')}</div><div class="jsp-sub">${esc(model.status||'Modèle spatial')} • Nord ${esc(model.orientation?.north||model.north||'top')}</div></div>`+
      zones.map(z=>`<div class="jsp-zone" data-id="${esc(z.id)}"><button class="jsp-zone-open"><div class="jsp-label">${esc(z.label||z.id)}</div><div class="jsp-summary">${esc(z.summary||'')}</div><div class="jsp-meta">${(z.entities||[]).length} entité(s)</div></button><div class="jsp-entities">${(z.entities||[]).map(e=>{const svc=serviceFor(e);return `<div class="jsp-entity"><div class="jsp-id">${esc(e)}</div>${svc?`<button class="jsp-action" data-entity="${esc(e)}" data-domain="${svc[0]}" data-service="${svc[1]}">Action</button>`:''}</div>`}).join('')||'<div class="jsp-sub">Aucune entité liée.</div>'}</div></div>`).join('');

    drawer.querySelectorAll('.jsp-zone-open').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.jsp-zone')?.classList.toggle('expanded')));
    drawer.querySelectorAll('.jsp-action').forEach(btn=>btn.addEventListener('click',async(ev)=>{
      ev.stopPropagation();const b=ev.currentTarget;b.disabled=true;const old=b.textContent;b.textContent='…';
      try{await request({type:'call_service',domain:b.dataset.domain,service:b.dataset.service,service_data:{entity_id:b.dataset.entity}});b.textContent='✓';setTimeout(()=>b.textContent=old,900);}catch(e){b.textContent='Erreur';setTimeout(()=>b.textContent=old,1200);}finally{b.disabled=false;}
    }));
  };

  const load=async()=>{
    try{model=await request({type:'get_spatial_model'});render();}
    catch(error){drawer.innerHTML=`<div class="jsp-head"><div class="jsp-title">Maison</div></div><div class="jsp-status jsp-error">Modèle spatial indisponible : ${esc(error?.message||error)}</div>`;}
  };

  trigger.addEventListener('click',()=>{drawer.classList.toggle('open');if(drawer.classList.contains('open')&&!model)load();});
})();
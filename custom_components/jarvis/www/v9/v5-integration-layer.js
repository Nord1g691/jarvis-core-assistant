/* JARVIS V9 — V5 integration layer
 * Additive only: V5 remains the visual/source-of-truth layer.
 * Loaded after the V9 bridge/bootstrap are available.
 */
(() => {
  'use strict';

  const CATS = [
    ['light','💡','Lumières'],
    ['climate','🌡️','Chauffage / Clim'],
    ['access','🚪','Accès'],
    ['pool','🏊','Piscine'],
    ['car','🚗','Voiture'],
    ['energy','⚡','Énergie'],
    ['media','🎵','Média'],
    ['camera','📷','Caméras'],
    ['cover','🪟','Volets'],
    ['inside-outside','🏠','Intérieur / Extérieur'],
    ['news','📰','News'],
    ['sport','⚽','Sport']
  ];

  const $ = (s, root=document) => root.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function style(){
    if ($('#j9-v5-style')) return;
    const s=document.createElement('style'); s.id='j9-v5-style';
    s.textContent=`
      #j9-menu{position:fixed;left:12px;top:12px;z-index:99990;font-family:Rajdhani,Arial,sans-serif}
      #j9-menu>button,#j9-actions button{width:38px;height:32px;min-height:32px;padding:0;border-radius:8px;background:rgba(2,12,24,.72);border:1px solid rgba(0,234,255,.28);color:#d9faff;font-size:16px;box-shadow:0 0 14px rgba(0,160,255,.08);backdrop-filter:blur(10px)}
      #j9-panel{display:none;margin-top:7px;width:min(310px,calc(100vw - 24px));max-height:78vh;overflow:auto;padding:12px;border:1px solid rgba(0,234,255,.25);border-radius:12px;background:rgba(2,10,20,.94);box-shadow:0 15px 45px rgba(0,0,0,.45),0 0 25px rgba(0,180,255,.12)}
      #j9-panel.open{display:block}
      #j9-panel h3{margin:0 0 9px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9ddff0}
      #j9-cats{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      #j9-cats button{width:100%;min-height:38px;text-align:left;padding:5px 8px;font-size:10px;letter-spacing:1px;text-transform:none}
      #j9-detail{margin-top:9px;padding-top:9px;border-top:1px solid rgba(0,200,255,.14);font-size:10px;color:#9ddff0}
      #j9-actions{position:fixed;right:12px;top:12px;z-index:99989;display:flex;gap:5px}
      #j9-actions button{font-size:13px}
      #j9-toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%) translateY(15px);opacity:0;pointer-events:none;z-index:100000;padding:8px 12px;border:1px solid rgba(0,234,255,.3);border-radius:9px;background:rgba(2,12,24,.94);color:#d9faff;font:600 10px Rajdhani,Arial;letter-spacing:1px;transition:.2s}
      #j9-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
    `; document.head.appendChild(s);
  }

  function toast(msg){
    let t=$('#j9-toast'); if(!t){t=document.createElement('div');t.id='j9-toast';document.body.appendChild(t)}
    t.textContent=msg;t.classList.add('show');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('show'),1800);
  }

  function log(msg){
    const line=`[${new Date().toLocaleTimeString()}] ${msg}`;
    try{(window.JARVIS_LOG||[]).push(line)}catch{}
    window.dispatchEvent(new CustomEvent('jarvis:log',{detail:line}));
  }

  function build(){
    if($('#j9-menu')) return;
    style();
    const root=document.createElement('div'); root.id='j9-menu';
    root.innerHTML=`<button aria-label="Menu JARVIS V9">☰</button><div id="j9-panel"><h3>JARVIS V9</h3><div id="j9-cats"></div><div id="j9-detail">Sélectionne une catégorie.</div></div>`;
    document.body.appendChild(root);
    root.querySelector('button').onclick=()=>$('#j9-panel').classList.toggle('open');

    const cats=$('#j9-cats');
    for(const [id,icon,label] of CATS){
      const b=document.createElement('button');b.dataset.cat=id;b.textContent=`${icon} ${label}`;
      b.onclick=()=>showCategory(id,label);cats.appendChild(b);
    }

    const actions=document.createElement('div');actions.id='j9-actions';
    actions.innerHTML=`<button title="Réglages">⚙</button><button title="Connexion">🔗</button><button title="Actualiser">↻</button><button title="Log">📋</button>`;
    document.body.appendChild(actions);
    actions.children[0].onclick=()=>window.dispatchEvent(new CustomEvent('jarvis:settings'));
    actions.children[1].onclick=()=>window.dispatchEvent(new CustomEvent('jarvis:connection'));
    actions.children[2].onclick=()=>refresh();
    actions.children[3].onclick=()=>showLog();
  }

  function getDashboard(){
    try{return window.JARVIS_V9_HUD?.getState?.() || null}catch{return null}
  }

  function showCategory(id,label){
    const d=getDashboard(); const entities=d?.entities?.[id] || d?.entityIndex?.[id] || [];
    const detail=$('#j9-detail');
    if(!entities.length){detail.innerHTML=`<b>${esc(label)}</b><br>0 entité détectée.`;return}
    detail.innerHTML=`<b>${esc(label)}</b><br>${entities.slice(0,30).map(e=>`${esc(e.entity_id||e.id)} — ${esc(e.state??'—')}`).join('<br>')}${entities.length>30?`<br>… +${entities.length-30}`:''}`;
  }

  async function refresh(){
    try{await window.JARVIS_V9_HUD?.refresh?.();toast('V9 actualisée');log('Actualisation V9');}
    catch(e){toast('Actualisation impossible');log('Erreur actualisation: '+e.message)}
  }

  async function showLog(){
    const lines=Array.isArray(window.JARVIS_LOG)?window.JARVIS_LOG.join('\n'):'Log JARVIS indisponible.';
    const copy=async()=>{try{await navigator.clipboard.writeText(lines);toast('Log copié');}catch{toast('Copie refusée par le navigateur')}};
    const box=document.createElement('div');box.style.cssText='position:fixed;inset:12%;z-index:100001;background:rgba(2,10,20,.97);border:1px solid rgba(0,234,255,.3);border-radius:12px;padding:12px;color:#d9faff;font:10px monospace;overflow:auto;white-space:pre-wrap';
    box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px"><b>LOG JARVIS</b><span><button id="j9-copy">⧉ Copier le log</button> <button id="j9-close">×</button></span></div>${esc(lines)}`;
    document.body.appendChild(box);$('#j9-copy',box).onclick=copy;$('#j9-close',box).onclick=()=>box.remove();
  }

  function start(){build();log('Couche V5/V9 prête');}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  window.addEventListener('jarvis:v9-hud-ready',start,{once:true});
})();

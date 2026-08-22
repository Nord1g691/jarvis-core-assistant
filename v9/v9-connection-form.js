/** JARVIS V9 — actual connection form, mounted inside the V9 settings panel. */
(() => {
  'use strict';
  const ui=()=>window.JARVIS_V9_CONNECTION_UI;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function render(target){
    if(!target)return;
    const s=ui()?.view?.()||{status:'disconnected',url:'',error:''};
    target.innerHTML=`<div class="jv9-connection-form"><label>URL Home Assistant<input name="url" type="url" autocomplete="url" value="${esc(s.url)}" placeholder="https://…"></label><label>Token<input name="token" type="password" autocomplete="off" placeholder="Jeton Home Assistant"></label><button type="submit">${s.status==='connecting'?'Connexion…':'Valider la connexion'}</button><div class="jv9-connection-status" role="status">${esc(s.label||'Déconnecté')}${s.error?`<br><small>${esc(s.error)}</small>`:''}</div></div>`;
    const form=target.querySelector('form')||target.querySelector('.jv9-connection-form');
    const submit=async e=>{e?.preventDefault?.();const url=target.querySelector('[name="url"]')?.value;const token=target.querySelector('[name="token"]')?.value;const button=target.querySelector('button[type="submit"]');if(button)button.disabled=true;try{await ui()?.connect?.(url,token);render(target)}catch(_){render(target)}finally{if(button)button.disabled=false}};
    form?.addEventListener('submit',submit);target.querySelector('button[type="submit"]')?.addEventListener('click',submit);
  }
  window.JARVIS_V9_CONNECTION_FORM=Object.freeze({render});
})();

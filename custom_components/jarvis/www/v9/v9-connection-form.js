/** JARVIS V9 — native HA connection form. */
(()=>{'use strict';
const ui=()=>window.JARVIS_V9_CONNECTION_UI;
function render(target){
  if(!target)return;
  const s=ui()?.view?.()||{status:'disconnected',error:''};
  target.innerHTML=`<div class="jv9-connection-form"><div class="jv9-connection-status" role="status" aria-live="polite">${s.status==='connected'?'● Connecté directement à Home Assistant':s.status==='connecting'?'● Connexion à Home Assistant…':s.status==='error'?'● Erreur de connexion':'● Connexion native Home Assistant'}${s.error?`<br><small>${String(s.error)}</small>`:''}</div><button type="button" ${s.status==='connecting'?'disabled':''}>${s.status==='connected'?'✓ CONNECTÉ':'⚡ CONNECTER À HOME ASSISTANT'}</button></div>`;
  const button=target.querySelector('button');
  button?.addEventListener('click',async()=>{button.disabled=true;try{await ui()?.connect?.()}catch(_){}finally{render(target)}});
}
window.JARVIS_V9_CONNECTION_FORM=Object.freeze({render});
})();

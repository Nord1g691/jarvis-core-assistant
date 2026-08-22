/** JARVIS V9 — common UI quick actions and event contracts. */
(() => {
  'use strict';
  const emit=(name,detail={})=>window.dispatchEvent(new CustomEvent(name,{detail}));
  const api={
    refresh:async()=>{emit('jarvis:v9:refresh');return window.JARVIS_V9_SETTINGS_PANEL?.refresh?.()},
    copyLog:async()=>window.JARVIS_V9_SETTINGS_PANEL?.copyLog?.(),
    clearLog:()=>window.JARVIS_V9_SETTINGS_PANEL?.clearLog?.(),
    openMenu:()=>window.JARVIS_V9_MENU?.open?.(),
    closeMenu:()=>window.JARVIS_V9_MENU?.close?.(),
    openCategory:id=>{window.JARVIS_V9_MENU?.setCategory?.(id);emit('jarvis:v9:category-open',{id})},
    openSettings:()=>emit('jarvis:v9:open-settings'),
    openConnection:()=>emit('jarvis:v9:open-connection'),
    status:()=>window.JARVIS_V9_CORE?.getConnection?.()
  };
  window.JARVIS_V9_QUICK_ACTIONS=Object.freeze(api);
})();

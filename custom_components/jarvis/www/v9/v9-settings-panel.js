/** JARVIS V9 — native Home Assistant settings panel API. */
(()=>{'use strict';
const core=()=>window.JARVIS_V9_CORE;
const api={read:()=>core()?.getConnection?.(),settings:()=>core()?.readSettings?.(),connect:()=>core()?.connectNative?.(),disconnect:()=>core()?.disconnect(),set:(section,key,value)=>core()?.setSetting(section,key,value),copyLog:()=>core()?.copyLog(),clearLog:()=>core()?.clearLog(),refresh:()=>window.JARVIS_V9_RUNTIME?.refreshEntities?.()};
window.JARVIS_V9_SETTINGS_PANEL=Object.freeze(api);
})();

/** JARVIS V9/V5 compatibility UI shim. The canonical UI is v9-ui-controller.js. */
(()=>{'use strict';const mount=()=>window.JARVIS_V9_UI?.mount?.(document.body);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();window.JARVIS_V9_V5_UI=Object.freeze({render:()=>window.JARVIS_V9_UI?.renderCategories?.()});})();

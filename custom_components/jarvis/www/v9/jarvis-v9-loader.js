/**
 * JARVIS V9 integration loader.
 * Additive only: loads the V9 contract and exposes a small runtime API.
 */
(() => {
  const boot = () => {
    if (!window.JARVIS_V9) return;

    window.JARVIS_V9_RUNTIME = Object.freeze({
      version: window.JARVIS_V9.version,
      getCategories: () => window.JARVIS_V9.categories,
      getSettings: () => window.JARVIS_V9.settings,
      classifyEntity: window.JARVIS_V9.classifyEntity,
      buildEntityIndex: window.JARVIS_V9.buildEntityIndex,
      dashboard: window.JARVIS_V9.dashboard
    });

    window.dispatchEvent(new CustomEvent('jarvis:v9-ready', {
      detail: window.JARVIS_V9_RUNTIME
    }));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

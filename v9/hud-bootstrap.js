/** V9 HUD bootstrap: non-invasive integration point for the existing dashboard. */
(() => {
  const start = () => {
    const bridge = window.JARVIS_V9_BRIDGE;
    if (!bridge || window.JARVIS_V9_HUD) return;

    const emit = () => window.dispatchEvent(new CustomEvent('jarvis:v9-dashboard-update', {
      detail: bridge.buildDashboard()
    }));

    window.JARVIS_V9_HUD = Object.freeze({
      refresh: emit,
      getState: () => bridge.buildDashboard(),
      getEntities: () => bridge.getEntities(),
      getMenu: () => bridge.getMenu(),
      getLayout: () => bridge.getLayout(),
      validateAction: descriptor => bridge.validateAction(descriptor)
    });

    bridge.subscribe(emit);
    window.addEventListener('jarvis:v9-layout-changed', emit);
    window.addEventListener('jarvis:v9-menu-changed', emit);
    emit();
    window.dispatchEvent(new CustomEvent('jarvis:v9-hud-ready'));
  };

  if (window.JARVIS_V9_BRIDGE) start();
  else window.addEventListener('jarvis:v9-bridge-ready', start, { once: true });
})();

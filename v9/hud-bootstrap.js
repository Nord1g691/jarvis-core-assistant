/** V9 HUD bootstrap: non-invasive integration point for the existing dashboard. */
(() => {
  const start = () => {
    const bridge = window.JARVIS_V9_BRIDGE;
    if (!bridge || window.JARVIS_V9_HUD) return;
    const emit = () => window.dispatchEvent(new CustomEvent('jarvis:v9-dashboard-update', { detail: bridge.buildDashboard() }));
    window.JARVIS_V9_HUD = Object.freeze({
      refresh: () => bridge.refresh(), getState: () => bridge.buildDashboard(), getEntities: () => bridge.getEntities(),
      getMenu: () => bridge.getMenu(), getSettings: () => bridge.getSettings(), getLayout: () => bridge.getLayout(),
      routeContext: request => bridge.routeContext(request), getRuntime: () => bridge.getRuntime(),
      validateAction: descriptor => bridge.validateAction(descriptor), executeAction: (descriptor, transport) => bridge.executeAction(descriptor, transport)
    });
    bridge.subscribe(emit);
    ['jarvis:v9-layout-changed','jarvis:v9-selection-changed','jarvis:v9-menu-changed','jarvis:v9-settings-changed','jarvis:v9:entities','jarvis:v9:error'].forEach(name => window.addEventListener(name, emit));
    emit();
    window.dispatchEvent(new CustomEvent('jarvis:v9-hud-ready'));
  };
  if (window.JARVIS_V9_BRIDGE) start(); else window.addEventListener('jarvis:v9-bridge-ready', start, { once: true });
})();

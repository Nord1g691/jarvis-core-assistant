/** V9 HUD bootstrap: non-invasive integration point for the existing dashboard. */
(() => {
  const start = () => {
    const bridge = window.JARVIS_V9_BRIDGE;
    if (!bridge) return;

    window.JARVIS_V9_HUD = Object.freeze({
      refresh() {
        window.dispatchEvent(new CustomEvent('jarvis:v9-dashboard-update', {
          detail: bridge.buildDashboard()
        }));
      },
      getState() {
        return bridge.buildDashboard();
      }
    });

    bridge.subscribe(() => window.JARVIS_V9_HUD.refresh());
    window.JARVIS_V9_HUD.refresh();
    window.dispatchEvent(new CustomEvent('jarvis:v9-hud-ready'));
  };

  if (window.JARVIS_V9_BRIDGE) start();
  else window.addEventListener('jarvis:v9-bridge-ready', start, { once: true });
})();

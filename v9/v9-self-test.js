/** JARVIS V9 self-test: run after v9/loader.js has loaded all modules. No network calls are made. */
(() => {
  const tests = [];
  const check = (name, fn) => {
    try { const value = fn(); tests.push({ name, ok: value !== false }); }
    catch (error) { tests.push({ name, ok: false, error: String(error?.message || error) }); }
  };
  const run = () => {
    tests.length = 0;
    check('config loaded', () => window.JARVIS_V9?.version === '9.0');
    check('all categories declared', () => window.JARVIS_V9?.categories?.length >= 10);
    check('policy accepts valid light action', () => window.JARVIS_V9_ACTION_POLICY?.validate({ entity_id: ['light.test'], action: 'turn_on', data: {} })?.ok === true);
    check('policy rejects domain mismatch', () => window.JARVIS_V9_ACTION_POLICY?.validate({ entity_id: ['light.test'], action: 'lock', data: {} })?.reason === 'action-domain-mismatch');
    check('policy rejects invalid temperature', () => window.JARVIS_V9_ACTION_POLICY?.validate({ entity_id: ['climate.test'], action: 'set_temperature', data: { temperature: 999 } })?.ok === false);
    check('policy keeps multi-entity target', () => window.JARVIS_V9_ACTION_POLICY?.validate({ entity_id: ['light.a', 'light.b'], action: 'turn_off', data: {} })?.descriptor?.entity_id?.length === 2);
    check('selection sanitizes invalid ids', () => window.JARVIS_V9_SELECTION?.sanitize({ categories: { light: ['light.a', 'bad', 'light.a'] }, layout: 'orbital' })?.categories?.light?.length === 1);
    check('settings sanitizes invalid layout', () => window.JARVIS_V9_SETTINGS?.sanitize({ dashboard: { layout: 'invalid' } })?.dashboard?.layout === 'none');
    check('state store exists', () => typeof window.JARVIS_V9_HA?.replace === 'function' && typeof window.JARVIS_V9_HA?.subscribe === 'function');
    check('dashboard builds from entities', () => {
      const entity = { entity_id: 'light.test', state: 'on', attributes: { friendly_name: 'Test' } };
      const model = window.JARVIS_V9_DASHBOARD?.build?.([entity], {});
      return model?.meta?.totalCards >= 1;
    });
    check('bridge exposes runtime controls', () => typeof window.JARVIS_V9_BRIDGE?.refresh === 'function' && typeof window.JARVIS_V9_BRIDGE?.executeAction === 'function');
    check('hud bootstrap exposes state', () => typeof window.JARVIS_V9_HUD?.getState === 'function');
    const passed = tests.filter(test => test.ok).length;
    const result = { ok: passed === tests.length, passed, total: tests.length, tests, generatedAt: Date.now() };
    window.JARVIS_V9_SELF_TEST_RESULT = result;
    window.dispatchEvent(new CustomEvent('jarvis:v9-self-test', { detail: result }));
    return result;
  };
  window.JARVIS_V9_SELF_TEST = Object.freeze({ run });
})();

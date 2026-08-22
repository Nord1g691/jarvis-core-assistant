/** V9 action gateway: final guard before a Home Assistant service call is delegated. */
(() => {
  const execute = async (descriptor, transport) => {
    const policy = window.JARVIS_V9_ACTION_POLICY;
    const result = policy?.validate?.(descriptor);
    if (!result?.ok) throw new Error(`JARVIS V9 action rejected: ${result?.reason || 'invalid'}`);
    if (typeof transport !== 'function') throw new Error('JARVIS V9 action transport unavailable');
    return transport(result.descriptor);
  };
  window.JARVIS_V9_ACTION_GATEWAY = Object.freeze({ execute });
})();

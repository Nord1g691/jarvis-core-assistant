/** V9 Home Assistant state store: framework-neutral event/state bridge. */
(() => {
  const entities = new Map();
  const listeners = new Set();

  const emit = () => {
    const snapshot = [...entities.values()];
    listeners.forEach(fn => { try { fn(snapshot); } catch (_) {} });
    window.dispatchEvent(new CustomEvent('jarvis:v9-state-changed', { detail: snapshot }));
  };

  const replace = (states = []) => {
    entities.clear();
    states.forEach(entity => {
      if (entity?.entity_id) entities.set(entity.entity_id, entity);
    });
    emit();
  };

  const update = (entity) => {
    if (!entity?.entity_id) return;
    entities.set(entity.entity_id, { ...(entities.get(entity.entity_id) || {}), ...entity });
    emit();
  };

  const remove = (entityId) => {
    entities.delete(entityId);
    emit();
  };

  const get = (entityId) => entities.get(entityId) || null;
  const all = () => [...entities.values()];
  const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

  window.JARVIS_V9_HA = Object.freeze({ replace, update, remove, get, all, subscribe });
})();

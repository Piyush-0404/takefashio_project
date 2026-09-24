const SYNC_EVENT_NAME = 'takefashion:catalog_update';
const STORAGE_KEY = 'takefashion:catalog_update';

export function broadcastCatalogUpdate(entity = 'catalog', action = 'updated', payload = {}) {
  if (typeof window === 'undefined') return null;

  const detail = {
    entity,
    action,
    payload,
    timestamp: Date.now(),
  };

  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(detail));
  } catch (error) {
    // Ignore storage quota errors. The custom event still updates the current tab.
  }

  return detail;
}

export function subscribeCatalogUpdates(listener) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const data = JSON.parse(event.newValue);
      listener(data);
    } catch (error) {
      // Ignore malformed payloads.
    }
  };

  const handleEvent = (event) => {
    if (event?.detail) listener(event.detail);
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(SYNC_EVENT_NAME, handleEvent);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(SYNC_EVENT_NAME, handleEvent);
  };
}

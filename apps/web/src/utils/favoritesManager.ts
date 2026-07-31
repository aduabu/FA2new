export interface FavoriteRecord {
  entity: string;
  id: string | number;
  title: string;
  timestamp?: number;
}

const FAV_KEY = 'ref_erp_favorites';
const RECENT_KEY = 'ref_erp_recent_records';

export function getFavorites(): FavoriteRecord[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(entity: string, id: string | number): boolean {
  const list = getFavorites();
  return list.some(item => item.entity === entity && String(item.id) === String(id));
}

export function toggleFavorite(record: FavoriteRecord): boolean {
  const list = getFavorites();
  const index = list.findIndex(item => item.entity === record.entity && String(item.id) === String(record.id));
  
  if (index >= 0) {
    list.splice(index, 1);
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
    return false;
  } else {
    list.unshift({ ...record, timestamp: Date.now() });
    localStorage.setItem(FAV_KEY, JSON.stringify(list.slice(0, 50)));
    return true;
  }
}

export function getRecentRecords(): FavoriteRecord[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentRecord(record: FavoriteRecord): void {
  try {
    const list = getRecentRecords().filter(
      item => !(item.entity === record.entity && String(item.id) === String(record.id))
    );
    list.unshift({ ...record, timestamp: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 20)));
  } catch (e) {
    console.warn('Failed to save recent record', e);
  }
}

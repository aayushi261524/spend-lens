export const STORAGE_KEYS = {
  transactions: 'expenseTracker.transactions',
  categories: 'expenseTracker.categories',
  budgets: 'expenseTracker.budgets',
  recurring: 'expenseTracker.recurring',
  settings: 'expenseTracker.settings',
  theme: 'expenseTracker.theme',
  dataVersion: 'expenseTracker.dataVersion',
};

export const DATA_VERSION = 1;

export function safeParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function initializeStorageVersion() {
  try {
    const current = Number(window.localStorage.getItem(STORAGE_KEYS.dataVersion));
    if (!Number.isFinite(current) || current < 1) {
      window.localStorage.setItem(STORAGE_KEYS.dataVersion, String(DATA_VERSION));
    }
  } catch {
    // localStorage may be unavailable in restricted browser contexts.
  }
}

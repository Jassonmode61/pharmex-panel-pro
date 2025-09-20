// src/storage.js

export function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / private mode vs. yut
  }
}

// İsteyen default import kullansın diye opsiyonel default export da veriyoruz
export default { getStorage, setStorage };
// src/utils/session.js
/**
 * Basit oturum/yakın-çıkış (idle timeout) yöneticisi.
 * - Kullanıcı etkileşimlerinde "lastActivity" güncellenir.
 * - 15 dk hareketsizlikte onTimeout() tetiklenir.
 * - Zaman aşımından 60 sn önce uyarı verilir (onWarn).
 *
 * Not: Gerçekte bu mekanizma backend/JWT ile birlikte kullanılmalıdır.
 */

export const IDLE_LIMIT_MS = 15 * 60 * 1000; // 15 dk
const WARN_BEFORE_MS = 60 * 1000;            // 60 sn önce uyar

const STORAGE_KEYS = {
  LAST_ACTIVITY: "lastActivity",
  WARNED_AT: "idleWarnedAt",
};

function now() {
  return Date.now();
}

function touchActivity() {
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, String(now()));
  localStorage.removeItem(STORAGE_KEYS.WARNED_AT);
}

function getLastActivity() {
  const v = Number(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || 0);
  return Number.isFinite(v) ? v : 0;
}

export function initSessionWatcher({ onWarn, onTimeout, intervalMs = 5_000 } = {}) {
  if (!getLastActivity()) touchActivity();

  const activityEvents = ["click", "keydown", "mousemove", "wheel", "touchstart"];
  const onAnyActivity = () => touchActivity();
  activityEvents.forEach((ev) => window.addEventListener(ev, onAnyActivity, { passive: true }));

  const timer = setInterval(() => {
    const last = getLastActivity();
    const diff = now() - last;

    // Uyarı
    if (diff >= (IDLE_LIMIT_MS - WARN_BEFORE_MS) && diff < IDLE_LIMIT_MS) {
      const warned = Number(localStorage.getItem(STORAGE_KEYS.WARNED_AT) || 0);
      if (!warned && typeof onWarn === "function") {
        localStorage.setItem(STORAGE_KEYS.WARNED_AT, String(now()));
        const leftSec = Math.ceil((IDLE_LIMIT_MS - diff) / 1000);
        onWarn(leftSec);
      }
    }

    // Zaman aşımı
    if (diff >= IDLE_LIMIT_MS) {
      if (typeof onTimeout === "function") onTimeout();
    }
  }, intervalMs);

  // Durdurucu
  return () => {
    clearInterval(timer);
    activityEvents.forEach((ev) => window.removeEventListener(ev, onAnyActivity));
  };
}

/** Oturumu bilinçli sonlandır. */
export function endSession() {
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  localStorage.removeItem(STORAGE_KEYS.WARNED_AT);
}

/** Kullanıcı aktivitesi simüle et (örn. "Devam Et" tuşu). */
export function pokeActivity() {
  touchActivity();
}

/** (Demo) 2FA yardımcıları */
export const twoFA = {
  isEnabled() {
    return localStorage.getItem("twoFAEnabled") === "true";
  },
  setEnabled(v) {
    localStorage.setItem("twoFAEnabled", String(!!v));
  },
  generateCode() {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    sessionStorage.setItem("twoFACode", code);
    return code;
  },
  verify(code) {
    const current = sessionStorage.getItem("twoFACode");
    return code && current && code.trim() === current.trim();
  },
  clearCode() {
    sessionStorage.removeItem("twoFACode");
  },
};
import React, { useEffect, useMemo, useState } from "react";

/** Yerel ayarlar kaynağı (localStorage) */
const LS_KEY = "phx:settings";
const LOCK_COMMISSION = "phx:lock:commission";
const LOCK_DELIVERY   = "phx:lock:delivery";

const THEMES = ["Koyu", "Açık", "Sistem"];
const CURRENCIES = ["TRY", "USD", "EUR"];
const LOG_LEVELS = ["trace", "debug", "info", "warn", "error"];

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // varsayılanlar
  return {
    theme: "Koyu",
    currency: "TRY",
    notifications: true,
    versionTag: "v1.0.0",
    defaultCarrier: "PharmExpress",
    commissionRate: 7,
    deliveryFee: 30,
    sessionMinutes: 30,
    maintenance: false,
    logLevel: "info",
  };
}

function saveSettings(s) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

export default function Settings() {
  const [s, setS] = useState(loadSettings);

  // kilit durumları (localStorage’da ayrı saklıyoruz ki sayfa yenilense de hatırlansın)
  const [lockCommission, setLockCommission] = useState(
    () => localStorage.getItem(LOCK_COMMISSION) === "1"
  );
  const [lockDelivery, setLockDelivery] = useState(
    () => localStorage.getItem(LOCK_DELIVERY) === "1"
  );

  useEffect(() => {
    localStorage.setItem(LOCK_COMMISSION, lockCommission ? "1" : "0");
  }, [lockCommission]);
  useEffect(() => {
    localStorage.setItem(LOCK_DELIVERY, lockDelivery ? "1" : "0");
  }, [lockDelivery]);

  const onSubmit = (e) => {
    e.preventDefault();
    // kilitliyse değerleri yine de kaydediyoruz (sadece düzenlenmesini engelliyoruz)
    saveSettings(s);
  };

  // ufak yardımcı
  const number = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2 className="page-title">Ayarlar</h2>

      {/* Genel görünüm */}
      <fieldset className="fieldset">
        <legend>Genel görünüm</legend>
        <div className="grid-2">
          <label className="field">
            <span>Tema</span>
            <select
              value={s.theme}
              onChange={(e) => setS({ ...s, theme: e.target.value })}
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Para birimi</span>
            <select
              value={s.currency}
              onChange={(e) => setS({ ...s, currency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="field check">
            <input
              type="checkbox"
              checked={s.notifications}
              onChange={(e) => setS({ ...s, notifications: e.target.checked })}
            />
            <span>Bildirimler açık olsun</span>
          </label>

          <label className="field">
            <span>Panel sürüm etiketi</span>
            <input
              value={s.versionTag}
              onChange={(e) => setS({ ...s, versionTag: e.target.value })}
            />
          </label>
        </div>
      </fieldset>

      {/* İş kuralları */}
      <fieldset className="fieldset">
        <legend>İş kuralları</legend>

        <div className="grid-2">
          <label className="field">
            <span>Varsayılan kargo</span>
            <input
              value={s.defaultCarrier}
              onChange={(e) => setS({ ...s, defaultCarrier: e.target.value })}
            />
          </label>

          {/* Komisyon oranı (%)  — kilitli alan */}
          <label className="field">
            <span>
              Komisyon oranı (%)
              <button
                type="button"
                className={"lock-btn" + (lockCommission ? " on" : "")}
                aria-pressed={lockCommission}
                title={lockCommission ? "Kilidi aç" : "Kilitle"}
                onClick={() => setLockCommission((v) => !v)}
              >
                {lockCommission ? "🔒" : "🔓"}
              </button>
            </span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={s.commissionRate}
              disabled={lockCommission}
              onChange={(e) =>
                setS({ ...s, commissionRate: number(e.target.value, 0) })
              }
            />
          </label>

          {/* Teslimat ücreti (₺) — kilitli alan */}
          <label className="field">
            <span>
              Teslimat ücreti (₺)
              <button
                type="button"
                className={"lock-btn" + (lockDelivery ? " on" : "")}
                aria-pressed={lockDelivery}
                title={lockDelivery ? "Kilidi aç" : "Kilitle"}
                onClick={() => setLockDelivery((v) => !v)}
              >
                {lockDelivery ? "🔒" : "🔓"}
              </button>
            </span>
            <input
              type="number"
              step="1"
              min="0"
              value={s.deliveryFee}
              disabled={lockDelivery}
              onChange={(e) =>
                setS({ ...s, deliveryFee: number(e.target.value, 0) })
              }
            />
          </label>
        </div>
      </fieldset>

      {/* Güvenlik */}
      <fieldset className="fieldset">
        <legend>Güvenlik</legend>
        <div className="grid-2">
          <label className="field">
            <span>Oturum süresi (dk)</span>
            <select
              value={String(s.sessionMinutes)}
              onChange={(e) =>
                setS({ ...s, sessionMinutes: number(e.target.value, 30) })
              }
            >
              {[15, 30, 45, 60, 120].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      {/* Sistem */}
      <fieldset className="fieldset">
        <legend>Sistem</legend>
        <label className="field check">
          <input
            type="checkbox"
            checked={s.maintenance}
            onChange={(e) => setS({ ...s, maintenance: e.target.checked })}
          />
          <span>Bakım modu</span>
        </label>

        <label className="field" style={{ maxWidth: 360 }}>
          <span>Log seviyesi</span>
          <select
            value={s.logLevel}
            onChange={(e) => setS({ ...s, logLevel: e.target.value })}
          >
            {LOG_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={() => setS(loadSettings())}>
          İptal
        </button>
        <button className="btn primary" type="submit">
          Kaydet
        </button>
      </div>
    </form>
  );
}
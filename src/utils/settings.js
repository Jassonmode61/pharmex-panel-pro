export const getBool = (k, d = false) =>
  (localStorage.getItem(k) ?? String(d)) === "true";

export const getNum = (k, d = 0) => {
  const n = Number(localStorage.getItem(k));
  return Number.isFinite(n) ? n : d;
};

export const getStr = (k, d = "") => localStorage.getItem(k) ?? d;

export function loadBusinessSettings() {
  return {
    defaultShipping: getStr("defaultShipping", "PharmExpress"),
    commissionRate: getNum("commissionRate", 7),
    deliveryFee: getNum("deliveryFee", 30),
  };
}
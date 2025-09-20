// src/lib/toast.js - basit event tabanlı toast
const subs = new Set();
export function toast(msg, type='info') {
  subs.forEach(fn => fn({ id: Date.now()+Math.random(), msg, type }));
}
export function onToast(fn){ subs.add(fn); return () => subs.delete(fn); }
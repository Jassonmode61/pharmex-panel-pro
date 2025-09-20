const K = "audit_logs";
export function logEvent({type="info", message="", actor="system", meta=null}){
  const list = JSON.parse(localStorage.getItem(K)||"[]");
  list.unshift({ id: Date.now(), ts: new Date().toISOString(), type, message, actor, meta });
  localStorage.setItem(K, JSON.stringify(list.slice(0,500)));
}
export function getLogs(){ return JSON.parse(localStorage.getItem(K)||"[]"); }
export function clearLogs(){ localStorage.removeItem(K); }
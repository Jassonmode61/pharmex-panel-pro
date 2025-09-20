// src/components/DataState.jsx
export default function DataState({ state, children, emptyText='Kayıt yok.' }){
  if (state.loading) return <div className="card">Yükleniyor…</div>;
  if (state.error)   return <div className="card" style={{borderColor:'rgba(239,68,68,.35)'}}>Hata: {state.error}</div>;
  if (!state.items?.length) return <div className="card">{emptyText}</div>;
  return children;
}
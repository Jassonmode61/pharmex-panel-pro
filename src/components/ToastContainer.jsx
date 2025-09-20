// src/components/ToastContainer.jsx
import { useEffect, useState } from 'react';
import { onToast } from '../lib/toast';

export default function ToastContainer(){
  const [items, setItems] = useState([]);
  useEffect(()=>onToast(t=>{
    setItems(s => [...s, t]);
    const timer = setTimeout(()=> setItems(s => s.filter(x=>x.id!==t.id)), 2600);
    return () => clearTimeout(timer);
  }),[]);
  return (
    <div style={{position:'fixed',right:16,bottom:16,display:'grid',gap:8,zIndex:2000}}>
      {items.map(t=>(
        <div key={t.id}
             style={{
               background:t.type==='error'?'#dc2626':t.type==='success'?'#16a34a':'#0b1324',
               color:'#fff', border:'1px solid rgba(255,255,255,.12)', borderRadius:10,
               padding:'10px 12px', boxShadow:'0 8px 22px rgba(0,0,0,.35)'
             }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
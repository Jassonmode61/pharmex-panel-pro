import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, err:null, info:null }; }
  static getDerivedStateFromError(err){ return { hasError:true, err }; }
  componentDidCatch(err, info){ this.setState({ info }); console.error("UI Error:", err, info); }

  render(){
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        background:"#0b1324", color:"#e5e7eb", border:"1px solid #1f2937",
        borderRadius:12, padding:16
      }}>
        <div style={{fontWeight:700, marginBottom:8}}>Bir şeyler ters gitti 😕</div>
        <div style={{opacity:.8, fontSize:13, marginBottom:8}}>
          Bileşenler yüklenirken hata oluştu. Konsolda ayrıntılar var.
        </div>
        {this.state.err && (
          <pre style={{whiteSpace:"pre-wrap", fontSize:12, opacity:.8}}>
            {String(this.state.err)}
          </pre>
        )}
      </div>
    );
  }
}
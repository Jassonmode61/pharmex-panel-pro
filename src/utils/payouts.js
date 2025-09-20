export function calcPayoutBase(orders, kdvRate=20, commissionRate=10){
  const gross = (orders||[]).reduce((s,o)=>s+Number(o.subtotal||0),0);
  const commission = gross * (commissionRate/100);
  const beforeVat = gross - commission;
  const vat = beforeVat * (kdvRate/100);
  const net = beforeVat + vat;
  return { gross, commissionRate, commission, beforeVat, vat, kdvRate, net };
}
export const round2 = v => Math.round((Number(v)||0)*100)/100;

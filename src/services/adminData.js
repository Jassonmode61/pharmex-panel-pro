// Sahte veri & yardımcılar — backend hazır olana kadar
export async function getAllOrders() {
  // İstersen gerçek endpoint: `${import.meta.env.VITE_API_URL}/orders`
  return [
    { id: 1, total: 120.5, status: 'paid' },
    { id: 2, total: 80.0, status: 'paid' },
    { id: 3, total: 50.25, status: 'pending' }
  ]
}

export function computePayouts(orders) {
  // sadece 'paid' olanları topla
  return orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + Number(o.total || 0), 0)
}
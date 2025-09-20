// Basit stub; derleme hatasını kaldırır.
// Gerçek API bağlayınca burayı değiştirebilirsin.

export function getAllOrders() {
  return [
    { id: 1, total: 120.5 },
    { id: 2, total: 89.9 }
  ];
}

export function computePayouts(orders) {
  return orders.reduce((sum, o) => sum + (o.total || 0), 0);
}
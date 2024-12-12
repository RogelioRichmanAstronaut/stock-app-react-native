export function formatPrice(price: number): string {
  const absPrice = Math.abs(price);
  const formattedPrice = absPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return price < 0 ? `-$${formattedPrice}` : `$${formattedPrice}`;
}

export function formatPercentageChange(change: number): string {
  const formattedChange = change.toFixed(2);
  return change === 0 ? '0.00%' : `${change > 0 ? '+' : ''}${formattedChange}%`;
}

export function getChangeColor(change: number): string {
  if (change > 0) return '#4CAF50';
  if (change < 0) return '#F44336';
  return '#9E9E9E';
}

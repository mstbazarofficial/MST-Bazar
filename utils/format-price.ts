export function formatPrice(amount: number): string {
  const rounded = Math.floor(amount); // removes decimals
  return `৳ ${rounded.toLocaleString("en-BD")}`;
}

// For order amounts, where dropping decimals would stop a receipt adding up
export function formatExactPrice(amount: number): string {
  return `৳ ${amount.toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
}

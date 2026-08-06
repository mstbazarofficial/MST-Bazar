export function formatPrice(amount: number): string {
  const rounded = Math.floor(amount); // removes decimals
  return `৳ ${rounded.toLocaleString("en-BD")}`;
}

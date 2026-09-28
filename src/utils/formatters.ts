/**
 * Format numbers as Indian Rupee (INR) currency strings
 * e.g., 54999 -> ₹54,999
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDiscountPercentage = (original: number, current: number): number => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

// Currency utilities for Naira (NGN)

export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[₦,]/g, '')) || 0;
};

/**
 * Currency conversion utilities
 * Note: In production, use real-time exchange rates from an API
 */

export interface ExchangeRates {
  [currency: string]: number;
}

// Base rates (USD as base)
const MOCK_RATES: ExchangeRates = {
  USD: 1,
  CDF: 2500, // Congolese Franc
  TZS: 2500, // Tanzanian Shilling
  ZAR: 18, // South African Rand
  AOA: 830, // Angolan Kwanza
  KES: 150, // Kenyan Shilling
  EUR: 0.92,
  GBP: 0.79,
};

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates = MOCK_RATES
): number {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  
  if (!fromRate || !toRate) {
    throw new Error(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`);
  }
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;
  
  return Math.round(convertedAmount * 100) / 100;
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates = MOCK_RATES
): number {
  return convertCurrency(1, fromCurrency, toCurrency, rates);
}

/**
 * Format currency with symbol
 */
export function formatWithSymbol(amount: number, currency: string): string {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CDF: 'FC',
    TZS: 'TSh',
    ZAR: 'R',
    AOA: 'Kz',
    KES: 'KSh',
  };
  
  const symbol = symbols[currency] || currency;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return `${symbol}${formatted}`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return (amount * percentage) / 100;
}

/**
 * Calculate fee
 */
export function calculateFee(amount: number, feePercentage: number, minFee: number = 0): number {
  const calculatedFee = calculatePercentage(amount, feePercentage);
  return Math.max(calculatedFee, minFee);
}

/**
 * Calculate commission (TMSA cut)
 */
export function calculateCommission(
  amount: number,
  commissionRate: number = 2.5
): {
  commission: number;
  netAmount: number;
} {
  const commission = calculatePercentage(amount, commissionRate);
  const netAmount = amount - commission;
  
  return {
    commission: Math.round(commission * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
  };
}

/**
 * Round to currency precision
 */
export function roundCurrency(amount: number, precision: number = 2): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(amount * multiplier) / multiplier;
}

/**
 * Split payment between parties
 */
export function splitPayment(
  totalAmount: number,
  splits: { party: string; percentage: number }[]
): { party: string; amount: number }[] {
  const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0);
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('Split percentages must sum to 100%');
  }
  
  return splits.map(split => ({
    party: split.party,
    amount: roundCurrency(calculatePercentage(totalAmount, split.percentage)),
  }));
}

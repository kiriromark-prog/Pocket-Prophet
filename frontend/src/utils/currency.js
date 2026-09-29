const CURRENCY_SYMBOLS = {
  'USD': '$',
  'GBP': '£',
  'EUR': '€',
  'KES': 'KSh',
  'CAD': 'C$',
  'AUD': 'A$',
  'JPY': '¥',
  'INR': '₹',
  'NGN': '₦',
  'ZAR': 'R',
  'BRL': 'R$',
  'MXN': 'MX$',
  'CNY': '¥',
  'CHF': 'Fr',
  'RUB': '₽',
  'KRW': '₩',
  'SGD': 'S$',
  'HKD': 'HK$',
  'NOK': 'kr',
  'SEK': 'kr',
  'DKK': 'kr',
};

export function formatCurrency(amount, currency = 'USD', currencySymbol = '$') {
  const symbol = currencySymbol || CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
}

export function getCurrencySymbol(currency) {
  return CURRENCY_SYMBOLS[currency] || '$';
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneE164(phone: string, defaultCountryCode: string = '+243'): string {
  let cleaned = phone.replace(/\D/g, '');
  
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    cleaned = defaultCountryCode + cleaned;
  }
  
  return cleaned;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

/**
 * Format weight
 */
export function formatWeight(kg: number): string {
  if (kg < 1000) {
    return `${kg.toFixed(2)} kg`;
  }
  return `${(kg / 1000).toFixed(2)} tonnes`;
}

/**
 * Format distance
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  return `${km.toFixed(2)} km`;
}

/**
 * Format duration
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return `${hours}h ${remainingMinutes}min`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return `${days}d ${remainingHours}h`;
}

/**
 * Format mission number
 */
export function formatMissionNumber(prefix: string, sequenceNumber: number): string {
  return `${prefix}-${String(sequenceNumber).padStart(6, '0')}`;
}

/**
 * Format tracking reference
 */
export function formatTrackingReference(missionId: string): string {
  return missionId.substring(0, 8).toUpperCase();
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
}

/**
 * Mask sensitive data
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.substring(0, 2) + '***';
  return `${maskedUsername}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return '***';
  return phone.substring(0, 4) + '***' + phone.substring(phone.length - 2);
}

export function maskCardNumber(cardNumber: string): string {
  return '****-****-****-' + cardNumber.slice(-4);
}

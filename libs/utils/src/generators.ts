import { nanoid, customAlphabet } from 'nanoid';

/**
 * Generate unique ID
 */
export function generateId(prefix?: string): string {
  const id = nanoid();
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate short ID (for QR codes, etc.)
 */
export function generateShortId(length: number = 8): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
}

/**
 * Generate mission number
 */
export function generateMissionNumber(year: number, sequence: number): string {
  return `MSN-${year}-${String(sequence).padStart(6, '0')}`;
}

/**
 * Generate transaction ID
 */
export function generateTransactionId(prefix: string = 'TXN'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate listing number
 */
export function generateListingNumber(type: 'CARGO' | 'TRUCK', sequence: number): string {
  const prefix = type === 'CARGO' ? 'CRG' : 'TRK';
  return `${prefix}-${String(sequence).padStart(6, '0')}`;
}

/**
 * Generate QR code data for checkpoint
 */
export function generateCheckpointQR(
  missionId: string,
  checkpointId: string,
  timestamp: number
): string {
  return Buffer.from(
    JSON.stringify({
      m: missionId,
      c: checkpointId,
      t: timestamp,
    })
  ).toString('base64');
}

/**
 * Parse QR code data
 */
export function parseCheckpointQR(qrCode: string): {
  missionId: string;
  checkpointId: string;
  timestamp: number;
} | null {
  try {
    const decoded = Buffer.from(qrCode, 'base64').toString('utf8');
    const data = JSON.parse(decoded);
    return {
      missionId: data.m,
      checkpointId: data.c,
      timestamp: data.t,
    };
  } catch {
    return null;
  }
}

/**
 * Generate API key
 */
export function generateApiKey(): string {
  const prefix = 'tmsa_live';
  const key = nanoid(32);
  return `${prefix}_${key}`;
}

/**
 * Generate webhook secret
 */
export function generateWebhookSecret(): string {
  return nanoid(64);
}

/**
 * Generate OTP code
 */
export function generateOTP(length: number = 6): string {
  const digits = customAlphabet('0123456789', length);
  return digits();
}

/**
 * Generate reset token
 */
export function generateResetToken(): string {
  return nanoid(32);
}

import crypto from 'node:crypto';

export function createHmacSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyHmacSignature(payload: string, secret: string, signature: string): boolean {
  const expected = createHmacSignature(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function generateSecureToken(bytes = 48): string {
  return crypto.randomBytes(bytes).toString('hex');
}

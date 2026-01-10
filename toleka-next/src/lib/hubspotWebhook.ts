import crypto from "crypto";

// HubSpot webhook signature v3 (recommended): timestamp + method + url + body
// Ref: HubSpot docs "Verifying webhook signatures"
export function verifyHubSpotSignatureV3(params: {
  secret: string;
  signature: string;
  timestamp: string;
  httpMethod: string;
  url: string;
  rawBody: string;
}) {
  const { secret, signature, timestamp, httpMethod, url, rawBody } = params;

  // HubSpot suggests rejecting if timestamp too old (e.g. > 5min).
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const ageMs = Math.abs(Date.now() - ts);
  if (ageMs > 5 * 60 * 1000) return false;

  const source = `${httpMethod}${url}${rawBody}${timestamp}`;
  const digest = crypto.createHmac("sha256", secret).update(source).digest("base64");
  return timingSafeEqualBase64(signature, digest);
}

function timingSafeEqualBase64(a: string, b: string) {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}


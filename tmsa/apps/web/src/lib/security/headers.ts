export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "img-src 'self' data: https://maps.googleapis.com",
    "script-src 'self' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://maps.googleapis.com https://api.mapbox.com",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

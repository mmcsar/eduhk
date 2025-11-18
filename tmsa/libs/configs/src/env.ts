export type ServiceEnv = {
  port: number;
  internalApiKey: string;
  authServiceUrl: string;
  trackingServiceUrl: string;
  paymentServiceUrl: string;
};

export function loadGatewayEnv(env = process.env): ServiceEnv {
  return {
    port: Number(env.API_GATEWAY_PORT ?? 8080),
    internalApiKey: env.INTERNAL_API_KEY ?? 'dev-key',
    authServiceUrl: env.AUTH_SERVICE_URL ?? 'http://localhost:4001',
    trackingServiceUrl: env.TRACKING_SERVICE_URL ?? 'http://localhost:4002',
    paymentServiceUrl: env.PAYMENT_SERVICE_URL ?? 'http://localhost:4003',
  };
}

export interface AuthEnv {
  port: number;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessTtl: string;
  jwtRefreshTtl: string;
  oauthGoogleClientId?: string;
  oauthGoogleClientSecret?: string;
}

export function loadAuthEnv(env = process.env): AuthEnv {
  return {
    port: Number(env.AUTH_SERVICE_PORT ?? 4001),
    jwtAccessSecret: env.JWT_ACCESS_SECRET ?? 'access-secret',
    jwtRefreshSecret: env.JWT_REFRESH_SECRET ?? 'refresh-secret',
    jwtAccessTtl: env.JWT_ACCESS_TTL ?? '15m',
    jwtRefreshTtl: env.JWT_REFRESH_TTL ?? '7d',
    oauthGoogleClientId: env.OAUTH_GOOGLE_CLIENT_ID,
    oauthGoogleClientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
  };
}

export interface TrackingEnv {
  port: number;
  redisUrl: string;
}

export function loadTrackingEnv(env = process.env): TrackingEnv {
  return {
    port: Number(env.TRACKING_SERVICE_PORT ?? 4002),
    redisUrl: env.REDIS_URL ?? 'redis://localhost:6379',
  };
}

export interface PaymentEnv {
  port: number;
  stripeKey: string;
  cinetPayKey?: string;
  webhookSecret: string;
  hmacSecret: string;
}

export function loadPaymentEnv(env = process.env): PaymentEnv {
  return {
    port: Number(env.PAYMENT_SERVICE_PORT ?? 4003),
    stripeKey: env.PAYMENTS_STRIPE_KEY ?? 'sk_test',
    cinetPayKey: env.PAYMENTS_CINETPAY_KEY,
    webhookSecret: env.PAYMENTS_WEBHOOK_SECRET ?? 'webhook',
    hmacSecret: env.PAYMENTS_HMAC_SECRET ?? 'hmac-dev',
  };
}

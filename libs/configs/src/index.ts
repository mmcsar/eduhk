import * as dotenv from 'dotenv';

dotenv.config();

// ========== ENVIRONMENT ==========

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

// ========== DATABASE ==========

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tmsa';
export const POSTGRES_URI = process.env.POSTGRES_URI || '';
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// ========== AUTHENTICATION ==========

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// ========== API KEYS ==========

export const API_GATEWAY_KEY = process.env.API_GATEWAY_KEY || 'dev-gateway-key';
export const INTERNAL_SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY || 'dev-service-key';

// ========== PAYMENT PROVIDERS ==========

export const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY || '';
export const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID || '';
export const CINETPAY_SECRET_KEY = process.env.CINETPAY_SECRET_KEY || '';
export const CINETPAY_WEBHOOK_SECRET = process.env.CINETPAY_WEBHOOK_SECRET || '';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// ========== FILE STORAGE ==========

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_REGION = process.env.AWS_REGION || 'eu-west-1';
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'tmsa-documents';

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

// ========== NOTIFICATIONS ==========

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || '';
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || '';

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@tmsa.africa';

// ========== TRACKING ==========

export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN || '';

// ========== MONITORING ==========

export const SENTRY_DSN = process.env.SENTRY_DSN || '';
export const GRAFANA_URL = process.env.GRAFANA_URL || 'http://localhost:3001';
export const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

// ========== APPLICATION ==========

export const PORT = parseInt(process.env.PORT || '8080', 10);
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const MOBILE_DEEP_LINK = process.env.MOBILE_DEEP_LINK || 'tmsa://';

// ========== CORS ==========

export const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');

// ========== RATE LIMITING ==========

export const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
export const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

// ========== KAFKA ==========

export const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'tmsa-services';
export const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || 'tmsa-consumer-group';

// ========== ELASTICSEARCH ==========

export const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
export const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME || 'elastic';
export const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD || 'changeme';

// ========== BUSINESS LOGIC CONSTANTS ==========

export const TMSA_COMMISSION_RATE = 2.5; // 2.5%
export const DEFAULT_CURRENCY = 'USD';
export const SUPPORTED_CURRENCIES = ['USD', 'CDF', 'TZS', 'ZAR', 'AOA', 'KES'];
export const SUPPORTED_LANGUAGES = ['fr', 'en', 'sw', 'pt'];
export const DEFAULT_LANGUAGE = 'fr';

// Position tracking
export const POSITION_UPDATE_INTERVAL_MS = 30000; // 30 seconds
export const CHECKPOINT_RADIUS_METERS = 500; // 500m radius

// Files
export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Mission timeouts
export const MISSION_ASSIGNMENT_TIMEOUT_HOURS = 24;
export const CHECKPOINT_ARRIVAL_TIMEOUT_HOURS = 2;

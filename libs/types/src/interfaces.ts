// Interfaces - Service contracts and utility types

import { UserRole } from './enums';

// ========== JWT INTERFACES ==========

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  organizationId?: string;
  iat?: number;
  exp?: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

// ========== API RESPONSE INTERFACES ==========

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ========== SERVICE INTERFACES ==========

export interface IAuthService {
  login(email: string, password: string): Promise<JwtTokens>;
  register(data: any): Promise<JwtTokens>;
  refreshToken(refreshToken: string): Promise<JwtTokens>;
  logout(userId: string): Promise<void>;
  validateToken(token: string): Promise<JwtPayload>;
}

export interface ITrackingService {
  updatePosition(data: any): Promise<void>;
  getPositions(missionId: string): Promise<any[]>;
  subscribeToMission(missionId: string): void;
  unsubscribeFromMission(missionId: string): void;
}

export interface IPaymentService {
  initiatePayment(data: any): Promise<any>;
  verifyPayment(transactionId: string): Promise<any>;
  processWebhook(provider: string, data: any): Promise<void>;
  refundPayment(transactionId: string): Promise<any>;
}

export interface INotificationService {
  sendPush(userId: string, title: string, body: string, data?: any): Promise<void>;
  sendSMS(phone: string, message: string): Promise<void>;
  sendEmail(email: string, subject: string, html: string): Promise<void>;
}

export interface IFileService {
  uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getSignedUrl(fileUrl: string): Promise<string>;
}

// ========== SOCKET EVENTS ==========

export interface SocketEvents {
  // Client → Server
  'tracking:subscribe': (missionId: string) => void;
  'tracking:unsubscribe': (missionId: string) => void;
  'tracking:update': (data: any) => void;
  'checkpoint:arrived': (data: any) => void;
  
  // Server → Client
  'tracking:position': (data: any) => void;
  'mission:updated': (data: any) => void;
  'checkpoint:approved': (data: any) => void;
  'notification:new': (data: any) => void;
}

// ========== PAYMENT PROVIDER INTERFACES ==========

export interface PaymentProvider {
  name: string;
  initiatePayment(data: PaymentInitiationData): Promise<PaymentInitiationResponse>;
  verifyPayment(transactionId: string): Promise<PaymentVerificationResponse>;
  processWebhook(data: any, signature: string): Promise<WebhookProcessingResult>;
}

export interface PaymentInitiationData {
  amount: number;
  currency: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  metadata?: Record<string, any>;
  returnUrl?: string;
  notifyUrl?: string;
}

export interface PaymentInitiationResponse {
  transactionId: string;
  paymentUrl?: string;
  qrCode?: string;
  status: string;
  expiresAt?: Date;
}

export interface PaymentVerificationResponse {
  transactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
}

export interface WebhookProcessingResult {
  transactionId: string;
  status: string;
  verified: boolean;
  shouldProcess: boolean;
}

// ========== GEOLOCATION INTERFACES ==========

export interface RouteCalculation {
  distance: number; // km
  duration: number; // minutes
  waypoints: Waypoint[];
}

export interface Waypoint {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  name?: string;
  arrivalTime?: Date;
}

export interface GeofenceConfig {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // meters
}

// ========== RBAC INTERFACES ==========

export interface Permission {
  resource: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXECUTE';
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// ========== MONITORING INTERFACES ==========

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface LogEntry {
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  context?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ========== QUEUE INTERFACES ==========

export interface QueueJob<T = any> {
  id: string;
  name: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  priority: number;
  createdAt: Date;
}

export interface QueueProcessor<T = any> {
  process(job: QueueJob<T>): Promise<void>;
}

// ========== CONFIG INTERFACES ==========

export interface DatabaseConfig {
  type: 'mongodb' | 'postgres' | 'mysql';
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  tls?: boolean;
}

export interface ServiceConfig {
  name: string;
  port: number;
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  corsOrigins: string[];
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

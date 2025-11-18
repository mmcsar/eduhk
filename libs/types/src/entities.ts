import {
  UserRole,
  UserStatus,
  MissionStatus,
  MissionType,
  CargoType,
  CheckpointType,
  CheckpointStatus,
  VehicleType,
  VehicleStatus,
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
  TransactionType,
  DocumentType,
  Corridor,
  Language,
  ListingStatus,
  ListingType,
} from './enums';

// ========== BASE ENTITY ==========

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// ========== USER ENTITIES ==========

export interface User extends BaseEntity {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  language: Language;
  organizationId?: string;
  avatar?: string;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface Organization extends BaseEntity {
  name: string;
  type: 'MINE' | 'BROKER' | 'TRANSPORTER' | 'AGENT';
  registrationNumber: string;
  taxId: string;
  address: Address;
  contactEmail: string;
  contactPhone: string;
  verified: boolean;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Address {
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ========== MISSION ENTITIES ==========

export interface Mission extends BaseEntity {
  missionNumber: string;
  organizationId: string;
  driverId?: string;
  vehicleId?: string;
  status: MissionStatus;
  type: MissionType;
  cargoType: CargoType;
  corridor: Corridor;

  // Cargo details
  cargoDescription: string;
  weight: number; // in kg
  volume?: number; // in m3
  quantity?: number;
  value?: number; // in USD

  // Route
  origin: Location;
  destination: Location;
  checkpoints: Checkpoint[];
  estimatedDistance: number; // in km
  estimatedDuration: number; // in hours

  // Dates
  scheduledStartDate: Date;
  actualStartDate?: Date;
  estimatedArrival: Date;
  actualArrival?: Date;

  // Financial
  totalCost: number;
  currency: string;
  paymentStatus: PaymentStatus;

  // Documents
  billOfLadingId?: string;
  proofOfDeliveryId?: string;
  documents: string[]; // Document IDs

  // Metadata
  notes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface Location {
  name: string;
  address: string;
  coordinates: Coordinates;
  contactName?: string;
  contactPhone?: string;
}

export interface Checkpoint extends BaseEntity {
  missionId: string;
  type: CheckpointType;
  name: string;
  location: Location;
  order: number;
  status: CheckpointStatus;
  
  // Timing
  estimatedArrival: Date;
  actualArrival?: Date;
  departureTime?: Date;

  // Validation
  qrCode?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  documents: string[]; // Document IDs

  // For weighing stations
  weight?: number;
  weightTicketId?: string;
}

// ========== VEHICLE ENTITIES ==========

export interface Vehicle extends BaseEntity {
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  status: VehicleStatus;
  
  // Capacity
  maxWeight: number; // in kg
  maxVolume?: number; // in m3

  // Owner
  organizationId: string;
  currentDriverId?: string;

  // Documents
  insuranceExpiry: Date;
  roadworthinessExpiry: Date;
  documents: string[];

  // Tracking
  gpsDeviceId?: string;
  lastKnownLocation?: Coordinates;
  lastLocationUpdate?: Date;
}

// ========== TRACKING ENTITIES ==========

export interface TrackingPosition extends BaseEntity {
  missionId: string;
  vehicleId: string;
  driverId: string;
  coordinates: Coordinates;
  speed: number; // in km/h
  heading: number; // in degrees
  accuracy: number; // in meters
  timestamp: Date;
  
  // Additional data
  batteryLevel?: number;
  isMoving: boolean;
}

// ========== PAYMENT ENTITIES ==========

export interface Transaction extends BaseEntity {
  transactionId: string;
  type: TransactionType;
  
  // Parties
  fromUserId?: string;
  fromOrganizationId?: string;
  toUserId?: string;
  toOrganizationId?: string;

  // Amount
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;

  // Payment details
  paymentMethod: PaymentMethod;
  paymentProvider: PaymentProvider;
  status: PaymentStatus;

  // Provider references
  providerTransactionId?: string;
  providerResponse?: Record<string, any>;

  // Related entities
  missionId?: string;
  invoiceId?: string;

  // Metadata
  description: string;
  metadata?: Record<string, any>;
}

export interface Wallet extends BaseEntity {
  userId?: string;
  organizationId?: string;
  balance: number;
  currency: string;
  availableBalance: number; // balance - holds
  holds: WalletHold[];
}

export interface WalletHold {
  amount: number;
  reason: string;
  expiresAt: Date;
  relatedTransactionId?: string;
}

// ========== DOCUMENT ENTITIES ==========

export interface Document extends BaseEntity {
  type: DocumentType;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;

  // Ownership
  uploadedBy: string;
  organizationId?: string;

  // Related entities
  missionId?: string;
  vehicleId?: string;
  checkpointId?: string;

  // Metadata
  description?: string;
  tags: string[];
  metadata?: Record<string, any>;
}

// ========== MARKETPLACE ENTITIES ==========

export interface Listing extends BaseEntity {
  listingNumber: string;
  type: ListingType;
  status: ListingStatus;
  organizationId: string;
  contactUserId: string;

  // Common fields
  origin: Location;
  destination: Location;
  preferredCorridor?: Corridor;
  availableFrom: Date;
  availableUntil: Date;

  // For CARGO_AVAILABLE
  cargoType?: CargoType;
  cargoDescription?: string;
  weight?: number;
  volume?: number;
  value?: number;

  // For TRUCK_AVAILABLE
  vehicleId?: string;
  vehicleType?: VehicleType;
  capacity?: number;

  // Pricing
  proposedPrice?: number;
  currency: string;
  priceNegotiable: boolean;

  // Matching
  matchedWithListingId?: string;
  matchedAt?: Date;
  expiresAt: Date;

  // Metadata
  notes?: string;
  viewCount: number;
}

// ========== NOTIFICATION ENTITY ==========

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  channels: string[];
  sentAt?: Date;
}

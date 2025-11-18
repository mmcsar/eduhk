// DTOs - Data Transfer Objects for API requests/responses

import {
  UserRole,
  MissionStatus,
  MissionType,
  CargoType,
  Corridor,
  VehicleType,
  CheckpointType,
  Language,
} from './enums';
import { Coordinates, Location } from './entities';

// ========== AUTH DTOs ==========

export interface LoginDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  language: Language;
  organizationId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UserDto {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  language: Language;
}

// ========== MISSION DTOs ==========

export interface CreateMissionDto {
  type: MissionType;
  cargoType: CargoType;
  corridor: Corridor;
  cargoDescription: string;
  weight: number;
  volume?: number;
  quantity?: number;
  value?: number;
  
  origin: CreateLocationDto;
  destination: CreateLocationDto;
  checkpoints: CreateCheckpointDto[];
  
  scheduledStartDate: string;
  estimatedArrival: string;
  
  totalCost: number;
  currency: string;
  
  notes?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface CreateLocationDto {
  name: string;
  address: string;
  coordinates: Coordinates;
  contactName?: string;
  contactPhone?: string;
}

export interface CreateCheckpointDto {
  type: CheckpointType;
  name: string;
  location: CreateLocationDto;
  order: number;
  estimatedArrival: string;
}

export interface UpdateMissionStatusDto {
  status: MissionStatus;
  notes?: string;
}

export interface AssignMissionDto {
  driverId: string;
  vehicleId: string;
}

export interface MissionResponseDto {
  id: string;
  missionNumber: string;
  status: MissionStatus;
  type: MissionType;
  cargoType: CargoType;
  corridor: Corridor;
  cargoDescription: string;
  weight: number;
  origin: Location;
  destination: Location;
  scheduledStartDate: string;
  totalCost: number;
  currency: string;
  driver?: UserDto;
  vehicle?: VehicleResponseDto;
}

// ========== VEHICLE DTOs ==========

export interface CreateVehicleDto {
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  maxWeight: number;
  maxVolume?: number;
  insuranceExpiry: string;
  roadworthinessExpiry: string;
  gpsDeviceId?: string;
}

export interface VehicleResponseDto {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  status: string;
  maxWeight: number;
}

// ========== TRACKING DTOs ==========

export interface UpdatePositionDto {
  missionId: string;
  coordinates: Coordinates;
  speed: number;
  heading: number;
  accuracy: number;
  batteryLevel?: number;
}

export interface TrackingResponseDto {
  missionId: string;
  vehicleId: string;
  currentPosition: Coordinates;
  speed: number;
  lastUpdate: string;
  estimatedArrival: string;
}

// ========== CHECKPOINT DTOs ==========

export interface CheckInCheckpointDto {
  checkpointId: string;
  coordinates: Coordinates;
  qrCode?: string;
  notes?: string;
}

export interface ApproveCheckpointDto {
  checkpointId: string;
  weight?: number;
  notes?: string;
}

// ========== PAYMENT DTOs ==========

export interface InitiatePaymentDto {
  amount: number;
  currency: string;
  paymentMethod: string;
  missionId?: string;
  description: string;
}

export interface PaymentResponseDto {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  paymentUrl?: string;
}

export interface WebhookPayloadDto {
  provider: string;
  eventType: string;
  transactionId: string;
  data: Record<string, any>;
  signature: string;
}

// ========== MARKETPLACE DTOs ==========

export interface CreateListingDto {
  type: 'CARGO_AVAILABLE' | 'TRUCK_AVAILABLE';
  origin: CreateLocationDto;
  destination: CreateLocationDto;
  availableFrom: string;
  availableUntil: string;
  proposedPrice?: number;
  currency: string;
  priceNegotiable: boolean;
  
  // For cargo listings
  cargoType?: CargoType;
  cargoDescription?: string;
  weight?: number;
  volume?: number;
  
  // For truck listings
  vehicleId?: string;
  capacity?: number;
  
  notes?: string;
}

export interface SearchListingsDto {
  type?: 'CARGO_AVAILABLE' | 'TRUCK_AVAILABLE';
  origin?: string;
  destination?: string;
  corridor?: Corridor;
  availableFrom?: string;
  availableTo?: string;
  minWeight?: number;
  maxWeight?: number;
  cargoType?: CargoType;
  vehicleType?: VehicleType;
}

// ========== FILE UPLOAD DTOs ==========

export interface UploadDocumentDto {
  file: File | Buffer;
  type: string;
  missionId?: string;
  checkpointId?: string;
  description?: string;
}

export interface DocumentResponseDto {
  id: string;
  type: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

// ========== PAGINATION ==========

export interface PaginationDto {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ========== ERROR RESPONSE ==========

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: any;
  timestamp: string;
  path: string;
}

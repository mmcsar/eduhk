import { TMSAClient } from './client';
import { CreateVehicleDto, VehicleResponseDto, PaginatedResponse, PaginationDto } from '@tmsa/types';

export class VehiclesAPI {
  constructor(private client: TMSAClient) {}

  async create(data: CreateVehicleDto): Promise<VehicleResponseDto> {
    return this.client.post('/vehicles', data);
  }

  async list(params?: PaginationDto & { status?: string }): Promise<PaginatedResponse<VehicleResponseDto>> {
    return this.client.get('/vehicles', { params });
  }

  async getById(id: string): Promise<VehicleResponseDto> {
    return this.client.get(`/vehicles/${id}`);
  }

  async update(id: string, data: Partial<CreateVehicleDto>): Promise<VehicleResponseDto> {
    return this.client.patch(`/vehicles/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.client.delete(`/vehicles/${id}`);
  }

  async getAvailableVehicles(params?: PaginationDto): Promise<PaginatedResponse<VehicleResponseDto>> {
    return this.client.get('/vehicles/available', { params });
  }

  async assignDriver(vehicleId: string, driverId: string): Promise<VehicleResponseDto> {
    return this.client.post(`/vehicles/${vehicleId}/assign-driver`, { driverId });
  }

  async unassignDriver(vehicleId: string): Promise<VehicleResponseDto> {
    return this.client.post(`/vehicles/${vehicleId}/unassign-driver`);
  }

  async updateStatus(vehicleId: string, status: string): Promise<VehicleResponseDto> {
    return this.client.patch(`/vehicles/${vehicleId}/status`, { status });
  }

  async getMaintenanceHistory(vehicleId: string): Promise<any[]> {
    return this.client.get(`/vehicles/${vehicleId}/maintenance`);
  }

  async addMaintenanceRecord(vehicleId: string, data: any): Promise<any> {
    return this.client.post(`/vehicles/${vehicleId}/maintenance`, data);
  }
}

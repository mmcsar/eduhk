import { TMSAClient } from './client';
import {
  CreateMissionDto,
  UpdateMissionStatusDto,
  AssignMissionDto,
  MissionResponseDto,
  PaginatedResponse,
  PaginationDto,
} from '@tmsa/types';

export class MissionsAPI {
  constructor(private client: TMSAClient) {}

  async create(data: CreateMissionDto): Promise<MissionResponseDto> {
    return this.client.post('/missions', data);
  }

  async list(params?: PaginationDto & { status?: string }): Promise<PaginatedResponse<MissionResponseDto>> {
    return this.client.get('/missions', { params });
  }

  async getById(id: string): Promise<MissionResponseDto> {
    return this.client.get(`/missions/${id}`);
  }

  async update(id: string, data: Partial<CreateMissionDto>): Promise<MissionResponseDto> {
    return this.client.patch(`/missions/${id}`, data);
  }

  async updateStatus(id: string, data: UpdateMissionStatusDto): Promise<MissionResponseDto> {
    return this.client.patch(`/missions/${id}/status`, data);
  }

  async assign(id: string, data: AssignMissionDto): Promise<MissionResponseDto> {
    return this.client.post(`/missions/${id}/assign`, data);
  }

  async start(id: string): Promise<MissionResponseDto> {
    return this.client.post(`/missions/${id}/start`);
  }

  async complete(id: string): Promise<MissionResponseDto> {
    return this.client.post(`/missions/${id}/complete`);
  }

  async cancel(id: string, reason: string): Promise<MissionResponseDto> {
    return this.client.post(`/missions/${id}/cancel`, { reason });
  }

  async getMyMissions(params?: PaginationDto): Promise<PaginatedResponse<MissionResponseDto>> {
    return this.client.get('/missions/my', { params });
  }

  async getActiveMissions(params?: PaginationDto): Promise<PaginatedResponse<MissionResponseDto>> {
    return this.client.get('/missions/active', { params });
  }

  async getStats(): Promise<any> {
    return this.client.get('/missions/stats');
  }
}

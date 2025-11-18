import { TMSAClient } from './client';
import { DocumentResponseDto, PaginatedResponse, PaginationDto } from '@tmsa/types';

export class DocumentsAPI {
  constructor(private client: TMSAClient) {}

  async upload(file: File | Blob, metadata: {
    type: string;
    missionId?: string;
    checkpointId?: string;
    vehicleId?: string;
    description?: string;
  }): Promise<DocumentResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', metadata.type);
    
    if (metadata.missionId) formData.append('missionId', metadata.missionId);
    if (metadata.checkpointId) formData.append('checkpointId', metadata.checkpointId);
    if (metadata.vehicleId) formData.append('vehicleId', metadata.vehicleId);
    if (metadata.description) formData.append('description', metadata.description);

    return this.client.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getById(id: string): Promise<DocumentResponseDto> {
    return this.client.get(`/documents/${id}`);
  }

  async list(params?: PaginationDto & {
    missionId?: string;
    type?: string;
  }): Promise<PaginatedResponse<DocumentResponseDto>> {
    return this.client.get('/documents', { params });
  }

  async delete(id: string): Promise<void> {
    return this.client.delete(`/documents/${id}`);
  }

  async getDownloadUrl(id: string): Promise<{ url: string }> {
    return this.client.get(`/documents/${id}/download-url`);
  }

  async getMissionDocuments(missionId: string): Promise<DocumentResponseDto[]> {
    return this.client.get(`/documents/mission/${missionId}`);
  }

  async getVehicleDocuments(vehicleId: string): Promise<DocumentResponseDto[]> {
    return this.client.get(`/documents/vehicle/${vehicleId}`);
  }
}

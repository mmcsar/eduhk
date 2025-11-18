import { TMSAClient } from './client';
import { UpdatePositionDto, TrackingResponseDto, CheckInCheckpointDto } from '@tmsa/types';
import { Socket } from 'socket.io-client';

export class TrackingAPI {
  constructor(private client: TMSAClient) {}

  async updatePosition(data: UpdatePositionDto): Promise<void> {
    return this.client.post('/tracking/position', data);
  }

  async getTrackingInfo(missionId: string): Promise<TrackingResponseDto> {
    return this.client.get(`/tracking/mission/${missionId}`);
  }

  async getPositionHistory(missionId: string, limit?: number): Promise<any[]> {
    return this.client.get(`/tracking/mission/${missionId}/history`, { params: { limit } });
  }

  async checkInCheckpoint(data: CheckInCheckpointDto): Promise<void> {
    return this.client.post('/tracking/checkpoint/check-in', data);
  }

  // Real-time tracking via WebSocket
  subscribeToMission(missionId: string, onUpdate: (data: any) => void): void {
    const socket = this.client.connectSocket();
    socket.emit('tracking:subscribe', missionId);
    socket.on('tracking:position', onUpdate);
  }

  unsubscribeFromMission(missionId: string): void {
    const socket = this.client.getSocket();
    if (socket) {
      socket.emit('tracking:unsubscribe', missionId);
      socket.off('tracking:position');
    }
  }

  onMissionUpdated(callback: (data: any) => void): void {
    const socket = this.client.connectSocket();
    socket.on('mission:updated', callback);
  }

  onCheckpointApproved(callback: (data: any) => void): void {
    const socket = this.client.connectSocket();
    socket.on('checkpoint:approved', callback);
  }

  offMissionUpdated(): void {
    const socket = this.client.getSocket();
    if (socket) {
      socket.off('mission:updated');
    }
  }

  offCheckpointApproved(): void {
    const socket = this.client.getSocket();
    if (socket) {
      socket.off('checkpoint:approved');
    }
  }
}

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true, namespace: '/tracking' })
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('TrackingGateway');
  private subscriptions = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.unsubscribeAll(client.id);
  }

  @SubscribeMessage('tracking:subscribe')
  handleSubscribe(
    @MessageBody() missionId: string,
    @ConnectedSocket() client: Socket
  ) {
    if (!this.subscriptions.has(missionId)) {
      this.subscriptions.set(missionId, new Set());
    }
    this.subscriptions.get(missionId)!.add(client.id);
    this.logger.log(`Client ${client.id} subscribed to mission ${missionId}`);
  }

  @SubscribeMessage('tracking:unsubscribe')
  handleUnsubscribe(
    @MessageBody() missionId: string,
    @ConnectedSocket() client: Socket
  ) {
    this.subscriptions.get(missionId)?.delete(client.id);
    this.logger.log(`Client ${client.id} unsubscribed from mission ${missionId}`);
  }

  @SubscribeMessage('tracking:update')
  handlePositionUpdate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    // Broadcast to all subscribers of this mission
    const subscribers = this.subscriptions.get(data.missionId);
    if (subscribers) {
      subscribers.forEach(socketId => {
        client.to(socketId).emit('tracking:position', data);
      });
    }
  }

  private unsubscribeAll(clientId: string) {
    this.subscriptions.forEach(subscribers => {
      subscribers.delete(clientId);
    });
  }
}

import { TMSAClient } from './client';
import { InitiatePaymentDto, PaymentResponseDto, PaginatedResponse, PaginationDto } from '@tmsa/types';

export class PaymentsAPI {
  constructor(private client: TMSAClient) {}

  async initiatePayment(data: InitiatePaymentDto): Promise<PaymentResponseDto> {
    return this.client.post('/payments/initiate', data);
  }

  async getPaymentStatus(transactionId: string): Promise<any> {
    return this.client.get(`/payments/${transactionId}`);
  }

  async listTransactions(params?: PaginationDto): Promise<PaginatedResponse<any>> {
    return this.client.get('/payments/transactions', { params });
  }

  async getWalletBalance(): Promise<any> {
    return this.client.get('/payments/wallet/balance');
  }

  async depositToWallet(amount: number, paymentMethod: string): Promise<PaymentResponseDto> {
    return this.client.post('/payments/wallet/deposit', { amount, paymentMethod });
  }

  async withdrawFromWallet(amount: number, bankDetails: any): Promise<any> {
    return this.client.post('/payments/wallet/withdraw', { amount, bankDetails });
  }

  async requestRefund(transactionId: string, reason: string): Promise<any> {
    return this.client.post(`/payments/${transactionId}/refund`, { reason });
  }

  async getMissionPayment(missionId: string): Promise<any> {
    return this.client.get(`/payments/mission/${missionId}`);
  }

  async getPaymentMethods(): Promise<any[]> {
    return this.client.get('/payments/methods');
  }
}

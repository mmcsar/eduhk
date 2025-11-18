import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() data: any) {
    return this.paymentService.initiatePayment(data);
  }

  @Get(':transactionId')
  async getPaymentStatus(@Param('transactionId') transactionId: string) {
    return this.paymentService.getPaymentStatus(transactionId);
  }

  @Post('webhook/cinetpay')
  async cinetpayWebhook(@Body() data: any) {
    return this.paymentService.handleCinetPayWebhook(data);
  }

  @Post('webhook/stripe')
  async stripeWebhook(@Body() data: any) {
    return this.paymentService.handleStripeWebhook(data);
  }
}

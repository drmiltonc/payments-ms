import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ok } from 'assert';
import { PaymenSessionDto, PaymentSessionItemDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSession: PaymenSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSession);
    //return paymentSession;
  }
  @Post('webhook')
  stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);

  }


  @Get('success')
  success() {
    return {
      message: 'Payment successful',
      ok: true
    };
  }

  @Get('cancel')
  cancel() {
    return {
      message: 'Payment cancelled',
      ok: false
    };
  }







}

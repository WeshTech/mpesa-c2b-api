import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SimulatePaymentDto } from './dto/SimulatePayment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay')
  async simulatePayment(@Body() simulatePaymentDto: SimulatePaymentDto) {
    const { amount, phone, accountNumber } = simulatePaymentDto;
    return this.paymentService.simulateC2B(amount, phone, accountNumber);
  }

  @Post('validation')
  async validateTransaction(@Body() body: any) {
    return this.paymentService.validateTransaction(body);
  }

  @Post('confirmation')
  async confirmTransaction(@Body() body: any) {
    return this.paymentService.confirmTransaction(body);
  }
}

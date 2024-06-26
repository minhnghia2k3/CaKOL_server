import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Users } from 'src/users/schemas/users.schema';
import { CurrentUser } from 'src/users/users.decorator';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserActive } from 'src/users/guards/user-active.guard';
import { AdminRole } from 'src/users/guards/admin-role.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}
  @UseGuards(JwtAuthGuard, UserActive)
  @Post()
  async makePayment(@CurrentUser() user: Users) {
    return await this.paymentsService.makePayment(user._id);
  }

  @UseGuards(JwtAuthGuard, UserActive)
  @Get()
  async listUserReceipts(@CurrentUser() user: Users) {
    return await this.paymentsService.listReceipts(user._id);
  }

  @UseGuards(JwtAuthGuard, AdminRole)
  @Get('/all')
  async listReceipts() {
    return await this.paymentsService.listAllReceipts();
  }
}

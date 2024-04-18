import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payments, PaymentsSchema } from './schemas/payments.schema';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from 'src/carts/carts.module';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payments.name, schema: PaymentsSchema },
    ]),
    ConfigModule,
    CartsModule,
    UsersModule,
    HttpModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

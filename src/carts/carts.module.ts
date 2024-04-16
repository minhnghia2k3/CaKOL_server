import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Carts, CartsSchema } from './schemas/carts.schema';
import { UsersModule } from 'src/users/users.module';
import { KolsModule } from 'src/kols/kols.module';
import { OfficeHoursModule } from 'src/office-hours/office-hours.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Carts.name, schema: CartsSchema }]),
    UsersModule,
    KolsModule,
    OfficeHoursModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}

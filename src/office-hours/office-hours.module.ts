import { Module } from '@nestjs/common';
import { OfficeHoursController } from './office-hours.controller';
import { OfficeHoursService } from './office-hours.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OfficeHours, OfficeHoursSchema } from './schemas/officeHours.schema';
import { KolsModule } from 'src/kols/kols.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OfficeHours.name, schema: OfficeHoursSchema },
    ]),
    KolsModule,
    UsersModule,
  ],
  controllers: [OfficeHoursController],
  providers: [OfficeHoursService],
  exports: [OfficeHoursService],
})
export class OfficeHoursModule {}

import { Module } from '@nestjs/common';
import { KolsController } from './kols.controller';
import { KolsService } from './kols.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KOLs, KOLsSchema } from './schemas/kols.schema';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import {
  OfficeHours,
  OfficeHoursSchema,
} from 'src/office-hours/schemas/officeHours.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: KOLs.name, schema: KOLsSchema }]),
    MongooseModule.forFeature([
      { name: OfficeHours.name, schema: OfficeHoursSchema },
    ]),
    UsersModule,
    CategoriesModule,
    // OfficeHoursModule,
  ],
  controllers: [KolsController],
  providers: [KolsService],
  exports: [KolsService],
})
export class KolsModule {}

import { Module } from '@nestjs/common';
import { KolsController } from './kols.controller';
import { KolsService } from './kols.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KOLs, KOLsSchema } from './schemas/kols.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: KOLs.name, schema: KOLsSchema }]),
    UsersModule,
  ],
  controllers: [KolsController],
  providers: [KolsService],
})
export class KolsModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      'mongodb+srv://brozennvn:Ng26012003@cluster0.phlna8l.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { KolsModule } from './kols/kols.module';
import { CategoriesModule } from './categories/categories.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    KolsModule,
    CategoriesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/'),
      serveRoot: '/uploads/',
    }),
  ],
})
export class AppModule {}

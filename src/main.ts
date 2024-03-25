import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip `field` not included in Dto
      transform: true,
      transformOptions: { enableImplicitConversion: true }, // Imply query (default string)
    }),
  );
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();

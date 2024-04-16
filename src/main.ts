import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip `field` not included in Dto
      transform: true,
      transformOptions: { enableImplicitConversion: true }, // Imply query (default string)
    }),
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('CaKOL APIs')
    .setVersion('1.0')
    .addTag('cakol')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();

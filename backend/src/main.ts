import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

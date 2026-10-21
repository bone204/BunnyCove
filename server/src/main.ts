import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS with credentials for Web and Mobile clients
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Enable cookie parsing for Refresh Token HTTP-only cookies
  app.use(cookieParser());

  // Global DTO Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Response Format & Error Interceptors
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('🐰 Bunny Cove API')
    .setDescription(
      'Cozy, vibrant pink real-time multiplayer 2-player games (Caro, Bingo) and chat API for Bunny Cove.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT Access Token (Bearer <token>)',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Authentication', 'User registration, login, token refresh, and profile')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    customSiteTitle: '🐰 Bunny Cove API Docs',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🐰 Bunny Cove Server running on http://localhost:${port}`);
  logger.log(`📚 Swagger UI available on http://localhost:${port}/api/docs`);
}

bootstrap();


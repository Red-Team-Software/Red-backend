import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs/envs';
import { json } from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globlaPrefix = 'api';

  app.setGlobalPrefix(globlaPrefix);

  const config = new DocumentBuilder()
    .setTitle('GoDeli Red API')
    .setDescription('Endpoints API REST para la aplicacion de GoDeli')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globlaPrefix}/docs`, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(morgan('dev')); // log every request to the console

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(json({ limit: '20mb' }));
  await app.listen(3900);
  // console.log(envs)
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const versionFull = config.get('version.full');
  const versionPrefix = config.get('version.prefix');

  const docOptions = new DocumentBuilder()
    .setTitle('Lynix API')
    .setDescription('The Lynix API documentation')
    .setVersion(versionFull)
    .addServer("/" + versionPrefix, 'Version ' + versionFull + ' of the API')
    .addBearerAuth()
    .addTag('authentication')
    .addTag('companies')
    .addTag('users')
    .addTag('orders')
    .addTag('processes')
    .addTag('product-templates')
    .addTag('process-templates')
    .addTag('tools')
    .addTag('default')
    .build();

  const docs = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('docs', app, docs);
  
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  app.setGlobalPrefix(versionPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  app.useWebSocketAdapter(new SocketIoAdapter(app, ["http://localhost:4200"]));

  await app.listen(config.get('port'));
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const versionFull = config.get('version.full');
  const versionPrefix = config.get('version.prefix');

  const apiPort = config.get('api.port');
  const gatewayPort = config.get('gateway.port');

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
  
  app.use(json({ limit: '50mb'}));
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: config.get('client.host') 
  });
  
  app.setGlobalPrefix(versionPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  app.useWebSocketAdapter(new SocketIoAdapter(app, [config.get('client.host')], apiPort != gatewayPort ? gatewayPort : 0));

  await app.listen(apiPort);
}
bootstrap();

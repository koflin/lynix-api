import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';

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
    .addTag('companies')
    .addTag('users')
    .addTag('default')
    .build();

  const docs = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('docs', app, docs);
  
  app.enableCors();
  app.setGlobalPrefix(versionPrefix);

  await app.listen(config.get('port'));
}
bootstrap();

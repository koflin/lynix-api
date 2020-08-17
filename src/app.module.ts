import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        API_PORT: Joi.number().default(3000),
        VERSION_PREFIX: Joi.string(),
        VERSION_FULL: Joi.string(),
        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.string()
      })
    }),
    /*MongooseModule.forRoot('mongodb://localhost/'),*/
    CompaniesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

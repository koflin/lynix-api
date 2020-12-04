import { ToolsModule } from './core/tools/tools.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './core/companies/companies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './core/orders/orders.module';
import { AuthModule } from './core/auth/auth.module';
import configuration from './config/configuration';
import * as Joi from '@hapi/joi';
import { UsersModule } from './core/users/users.module';
import { DevModule } from './core/dev/dev.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        API_PORT: Joi.number().default(3000),
        VERSION_PREFIX: Joi.string().required(),
        VERSION_FULL: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_DB: Joi.string().required()
      })
    }),
    MongooseModule.forRoot(`mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DB}?authSource=${process.env.DATABASE_AUTH_DB}`, {
      useFindAndModify: false,
    }),
    CompaniesModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    ToolsModule,
    DevModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

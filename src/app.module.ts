import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AuthModule } from './core/auth/auth.module';
import { CompaniesModule } from './core/companies/companies.module';
import { DevModule } from './core/dev/dev.module';
import { OrdersModule } from './core/orders/orders.module';
import { ProcessesModule } from './core/processes/processes.module';
import { RolesModule } from './core/roles/roles.module';
import { TasksModule } from './core/tasks/tasks.module';
import { ProcessTemplatesModule } from './core/templates/process-templates/process-templates.module';
import { ProductTemplatesModule } from './core/templates/product-templates/product-templates.module';
import { ToolsModule } from './core/tools/tools.module';
import { UsersModule } from './core/users/users.module';

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
    ScheduleModule.forRoot(),
    CompaniesModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    ToolsModule,
    DevModule,
    ProcessTemplatesModule,
    ProductTemplatesModule,
    ProcessesModule,
    TasksModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AccountModule } from './core/account/account.module';
import { ActivationModule } from './core/activation/activation.module';
import { AdminModule } from './core/admin/admin.module';
import { AuthModule } from './core/auth/auth.module';
import { CompaniesModule } from './core/companies/companies.module';
import { DevModule } from './core/dev/dev.module';
import { EventModule } from './core/event/event.module';
import { MediaModule } from './core/media/media.module';
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
        API_PORT: Joi.number().required(),

        GATEWAY_PORT: Joi.number().required(),

        CLIENT_HOST: Joi.string().required(),

        VERSION_PREFIX: Joi.string().required(),
        VERSION_FULL: Joi.string().required(),

        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_AUTH_DB: Joi.string().required(),
        DATABASE_DB: Joi.string().required(),

        JWT_ISSUER: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_EXPIRATION: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().required(),

        COOKIES_DOMAIN: Joi.string().required(),
        COOKIES_SECURE: Joi.number().required(),
        COOKIES_SAME_SITE: Joi.string().required(),

        MEDIA_PATH: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${config.get('database.user')}:${config.get('database.password')}@${config.get('database.host')}:${config.get('database.port')}/${config.get('database.db')}?authSource=${config.get('database.authDb')}`,
        useFindAndModify: false,
        ignoreUndefined: true
      }),
    }),
    ScheduleModule.forRoot(),
    CompaniesModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    EventModule,
    ToolsModule,
    DevModule,
    ProcessTemplatesModule,
    ProductTemplatesModule,
    ProcessesModule,
    TasksModule,
    RolesModule,
    MediaModule,
    ActivationModule,
    AdminModule,
    AccountModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

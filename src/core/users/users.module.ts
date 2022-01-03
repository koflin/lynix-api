import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { ActivationModule } from '../activation/activation.module';
import { MetadataModule } from '../metadata/metadata.module';
import { CompaniesModule } from './../companies/companies.module';
import { RolesModule } from './../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: UserDoc.name, schema: UserSchema, collection: 'users',
    }]),
    RolesModule,
    ActivationModule,
    CompaniesModule,
    MetadataModule
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

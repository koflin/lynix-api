import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { ActivationModule } from '../activation/activation.module';
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
    CompaniesModule
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

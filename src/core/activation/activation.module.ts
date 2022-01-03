import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivationDoc, ActivationSchema } from 'src/schemas/activation.schema';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { AccountModule } from '../account/account.module';
import { ActivationController } from './activation.controller';
import { ActivationService } from './activation.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ActivationDoc.name, schema: ActivationSchema, collection: 'activations',
    },{
      name: UserDoc.name, schema: UserSchema, collection: 'users',
    }]),
    AccountModule
  ],
  exports: [ActivationService],
  controllers: [ActivationController],
  providers: [ActivationService]
})
export class ActivationModule {}

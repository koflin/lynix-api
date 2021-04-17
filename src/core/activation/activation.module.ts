import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivationDoc, ActivationSchema } from 'src/schemas/activation.schema';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { ActivationController } from './activation.controller';
import { ActivationService } from './activation.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ActivationDoc.name, schema: ActivationSchema, collection: 'activations',
    },{
      name: UserDoc.name, schema: UserSchema, collection: 'users',
    }])
  ],
  exports: [ActivationService],
  controllers: [ActivationController],
  providers: [ActivationService]
})
export class ActivationModule {}

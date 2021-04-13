import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivationDoc, ActivationSchema } from 'src/schemas/activation.schema';

import { UsersModule } from '../users/users.module';
import { ActivationController } from './activation.controller';
import { ActivationService } from './activation.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ActivationDoc.name, schema: ActivationSchema, collection: 'activations',
    }]),
    UsersModule
  ],
  controllers: [ActivationController],
  providers: [ActivationService]
})
export class ActivationModule {}

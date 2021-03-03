import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessDoc, ProcessSchema } from 'src/schemas/process.schema';

import { EventModule } from '../event/event.module';
import { ProcessTemplatesModule } from '../templates/process-templates/process-templates.module';
import { OrdersModule } from './../orders/orders.module';
import { ProcessesController } from './processes.controller';
import { ProcessesService } from './processes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: ProcessDoc.name, schema: ProcessSchema, collection: 'processes'
    }]),
    ProcessTemplatesModule,
    OrdersModule,
    EventModule
  ],
  providers: [ProcessesService],
  controllers: [ProcessesController],
  exports: [ProcessesService]
})
export class ProcessesModule {}

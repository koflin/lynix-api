import { OrdersModule } from './../orders/orders.module';
import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessDoc, ProcessSchema } from 'src/schemas/process.schema';
import { ProcessTemplatesModule } from '../templates/process-templates/process-templates.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: ProcessDoc.name, schema: ProcessSchema, collection: 'processes'
    }]),
    ProcessTemplatesModule,
    OrdersModule
  ],
  providers: [ProcessesService],
  controllers: [ProcessesController],
  exports: [ProcessesService]
})
export class ProcessesModule {}

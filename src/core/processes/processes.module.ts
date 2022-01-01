import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessDoc, ProcessSchema } from 'src/schemas/process.schema';
import { ProcessTemplateDoc, ProcessTemplateSchema } from 'src/schemas/processTemplate.schema';
import { StepDoc, StepSchema } from 'src/schemas/step.schema';

import { EventModule } from '../event/event.module';
import { MetadataModule } from '../metadata/metadata.module';
import { ProcessTemplatesModule } from '../templates/process-templates/process-templates.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from './../orders/orders.module';
import { ProcessesController } from './processes.controller';
import { ProcessesService } from './processes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: ProcessDoc.name, schema: ProcessSchema, collection: 'processes'
    },
    {
      name: ProcessTemplateDoc.name, schema: ProcessTemplateSchema, collection: 'processTemplates'
    },
    {
      name: StepDoc.name, schema: StepSchema
    }
    ]),
    ProcessTemplatesModule,
    OrdersModule,
    EventModule,
    UsersModule,
    MetadataModule
  ],
  providers: [ProcessesService],
  controllers: [ProcessesController],
  exports: [ProcessesService]
})
export class ProcessesModule {}

import { HttpModule, Module } from '@nestjs/common';
import { ProcessTemplatesService } from './process-templates.service';
import { ProcessTemplatesController } from './process-templates.controller';
import { ProcessTemplateDoc, ProcessTemplateSchema } from 'src/schemas/processTemplate.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ProcessTemplateDoc.name, schema: ProcessTemplateSchema, collection: 'processTemplates'
    }]),
  ],
  providers: [ProcessTemplatesService],
  controllers: [ProcessTemplatesController],
  exports: [ProcessTemplatesService]
})
export class ProcessTemplatesModule {}

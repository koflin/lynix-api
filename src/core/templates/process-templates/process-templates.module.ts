import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetadataModule } from 'src/core/metadata/metadata.module';
import { ProcessTemplateDoc, ProcessTemplateSchema } from 'src/schemas/processTemplate.schema';

import { ProcessTemplatesController } from './process-templates.controller';
import { ProcessTemplatesService } from './process-templates.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ProcessTemplateDoc.name, schema: ProcessTemplateSchema, collection: 'processTemplates'
    }]),
    MetadataModule
  ],
  providers: [ProcessTemplatesService],
  controllers: [ProcessTemplatesController],
  exports: [ProcessTemplatesService]
})
export class ProcessTemplatesModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetadataModule } from 'src/core/metadata/metadata.module';
import { ProductTemplateDoc, ProductTemplateSchema } from 'src/schemas/productTemplate.schema';

import { ProcessTemplatesModule } from '../process-templates/process-templates.module';
import { ProductTemplatesController } from './product-templates.controller';
import { ProductTemplatesService } from './product-templates.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ProductTemplateDoc.name, schema: ProductTemplateSchema, collection: 'productTemplates'
    }]),
    ProcessTemplatesModule,
    MetadataModule
  ],
  providers: [ProductTemplatesService],
  controllers: [ProductTemplatesController],
  exports: [ProductTemplatesService]
})
export class ProductTemplatesModule {}

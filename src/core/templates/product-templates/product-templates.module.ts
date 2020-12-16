import { HttpModule, Module } from '@nestjs/common';
import { ProductTemplatesService } from './product-templates.service';
import { ProductTemplatesController } from './product-templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolDoc, ToolSchema } from 'src/schemas/tool.schema';
import { ProductTemplateDoc, ProductTemplateSchema } from 'src/schemas/productTemplate.schema';
import { ProcessTemplatesService } from '../process-templates/process-templates.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ProductTemplateDoc.name, schema: ProductTemplateSchema, collection: 'productTemplates'
    }])
  ],
  providers: [ProductTemplatesService, ProcessTemplatesService],
  controllers: [ProductTemplatesController]
})
export class ProductTemplatesModule {}

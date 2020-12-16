import { HttpModule, Module } from '@nestjs/common';
import { ProductTemplatesService } from './product-templates.service';
import { ProductTemplatesController } from './product-templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolDoc, ToolSchema } from 'src/schemas/tool.schema';
import { ProductTemplateDoc, ProductTemplateSchema } from 'src/schemas/productTemplate.schema';
import { ProcessTemplatesService } from '../process-templates/process-templates.service';
import { ProcessTemplatesModule } from '../process-templates/process-templates.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ProductTemplateDoc.name, schema: ProductTemplateSchema, collection: 'productTemplates'
    }]),
    ProcessTemplatesModule
  ],
  providers: [ProductTemplatesService],
  controllers: [ProductTemplatesController],
  exports: [ProductTemplatesService]
})
export class ProductTemplatesModule {}

import { Module } from '@nestjs/common';
import { ProductTemplatesService } from './product-templates.service';
import { ProductTemplatesController } from './product-templates.controller';

@Module({
  providers: [ProductTemplatesService],
  controllers: [ProductTemplatesController]
})
export class ProductTemplatesModule {}

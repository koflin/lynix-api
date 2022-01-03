import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDoc, OrderSchema } from 'src/schemas/order.schema';

import { MetadataModule } from '../metadata/metadata.module';
import { ProductTemplatesModule } from '../templates/product-templates/product-templates.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: OrderDoc.name, schema: OrderSchema, collection: 'orders'
    }]),
    ProductTemplatesModule,
    MetadataModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [
    OrdersService
  ]
})
export class OrdersModule {}

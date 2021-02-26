import { Module, HttpModule } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDoc, OrderSchema } from 'src/schemas/order.schema';
import { ProductTemplatesModule } from '../templates/product-templates/product-templates.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: OrderDoc.name, schema: OrderSchema, collection: 'orders'
    }]),
    ProductTemplatesModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [
    OrdersService
  ]
})
export class OrdersModule {}

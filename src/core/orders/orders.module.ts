import { Module, HttpModule } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDoc, OrderSchema } from 'src/schemas/order.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: OrderDoc.name, schema: OrderSchema, collection: 'orders'
    }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

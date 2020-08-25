import { Controller, Post, Body } from '@nestjs/common';
import { Order } from 'src/models/order.model';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dto/order/createOrderDto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {

    constructor(private ordersService: OrdersService) {
    }

    @ApiOkResponse({ type: Order })
    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }
}

import { ParseIdPipe } from './../../pipes/parse-id.pipe';
import { Controller, Post, Body, Delete, Get, NotFoundException, Param, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Order } from 'src/models/order.model';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { EditOrderDto } from 'src/dto/order/editOrderDto';
import { User } from 'src/models/user.model';
import { Id } from 'src/dto/metadata/id';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) { }

    @ApiOkResponse({ type: [Order] })
    @ApiQuery({ name: 'companyId', required: false })
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.ordersService.getAll(filter);
    }

    @ApiOkResponse({ type: Order })
    @Post()
    create(@Body() editOrderDto: EditOrderDto) {
        return this.ordersService.create(editOrderDto);
    }

    @ApiOkResponse({ type: Order })
    @Get(':orderId')
    getById(@Param('orderId', new ParseIdPipe()) orderId: string) {
        let order = this.ordersService.getById(orderId);
        if (order == null) throw new NotFoundException('Order not found!');
        return order;
    }

    @ApiOkResponse({ type: Order })
    @Put(':orderId')
    edit(@Param('orderId', new ParseIdPipe()) orderId: string, @Body() editOrderDto: EditOrderDto) {
        let order = this.ordersService.edit(orderId, editOrderDto);
        if (order == null) throw new NotFoundException('Order not found!');
        return order;
    }

    @ApiOkResponse()
    @Delete(':orderId')
    delete(@Param('orderId', new ParseIdPipe()) orderId: string) {
        return this.ordersService.delete(orderId);
    }
}

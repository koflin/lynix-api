import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EditOrderDto } from 'src/dto/order/editOrderDto';
import { Order } from 'src/models/order.model';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { ParseIdPipe } from './../../pipes/parse-id.pipe';
import { Account } from './../auth/account.decorator';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) { }

    @ApiOkResponse({ type: [Order] })
    @ApiQuery({ name: 'companyId', required: false })
    @Permissions(Permission.VIEW)
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.ordersService.getAll(filter);
    }

    @ApiOkResponse({ type: Order })
    @Permissions(Permission.EDIT)
    @Post()
    create(@Account() user: User, @Body() editOrderDto: EditOrderDto) {
        return this.ordersService.create(editOrderDto, user);
    }

    @ApiOkResponse({ type: Order })
    @Permissions(Permission.VIEW)
    @Get(':orderId')
    getById(@Param('orderId', new ParseIdPipe()) orderId: string) {
        let order = this.ordersService.getById(orderId);
        if (order == null) throw new NotFoundException('Order not found!');
        return order;
    }

    @ApiOkResponse({ type: Order })
    @Permissions(Permission.EDIT)
    @Put(':orderId')
    edit(@Param('orderId', new ParseIdPipe()) orderId: string, @Body() editOrderDto: EditOrderDto) {
        let order = this.ordersService.edit(orderId, editOrderDto);
        if (order == null) throw new NotFoundException('Order not found!');
        return order;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':orderId')
    delete(@Param('orderId', new ParseIdPipe()) orderId: string) {
        return this.ordersService.delete(orderId);
    }
}

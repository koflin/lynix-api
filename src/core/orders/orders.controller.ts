import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { filter } from 'rxjs/operators';
import { EditOrderDto } from 'src/dto/order/editOrder.dto';
import { ApplyDocumentMetadata } from 'src/interceptors/document-metadata/apply-document-metadata.decorator';
import { DocumentMetadataType } from 'src/interceptors/document-metadata/document-metadata';
import { DocumentMetadata } from 'src/interceptors/document-metadata/document-metadata.decorator';
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
@ApplyDocumentMetadata(OrdersService)
@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) { }

    @ApiOkResponse({ type: [Order] })
    @ApiQuery({ name: 'companyId', required: false })
    @Permissions(Permission.ORDER_VIEW)
    @Get()
    getAll(@Account() user: User, @Query() filter: { status: any }) {
        if (!user.role?.hasPermission(Permission.ORDER_EDIT)) {
            filter.status = { $in: ['released', 'in_progress'] };
        }

        return this.ordersService.getAll({ companyId: user.companyId, status: filter.status });
    }

    @ApiOkResponse({ type: Order })
    @Permissions(Permission.ORDER_EDIT)
    @DocumentMetadata(DocumentMetadataType.CREATED_AT, DocumentMetadataType.CREATED_BY)
    @Post()
    create(@Account() user: User, @Body() editOrderDto: EditOrderDto) {
        return this.ordersService.create(editOrderDto, user);
    }

    @ApiOkResponse({ type: Order })
    @Permissions(Permission.ORDER_VIEW)
    @Get(':orderId')
    async getById(@Param('orderId', new ParseIdPipe()) orderId: string) {
        const order = await this.ordersService.getById(orderId);
        if (order == null) throw new NotFoundException('Order not found!');
        return order;
    }

    @ApiOkResponse({ type: Order })
    @Permissions(Permission.ORDER_EDIT)
    @DocumentMetadata(DocumentMetadataType.EDITED_AT, DocumentMetadataType.EDITED_BY)
    @Put(':orderId')
    async edit(@Param('orderId', new ParseIdPipe()) orderId: string, @Body() editOrderDto: EditOrderDto) {
        const order = await this.ordersService.edit(orderId, editOrderDto);
        if (order == null) throw new NotFoundException('Order not found!');
        return order;
    }

    @ApiOkResponse()
    @Permissions(Permission.ORDER_EDIT)
    @DocumentMetadata(DocumentMetadataType.DELETED_AT, DocumentMetadataType.DELETED_BY)
    @Delete(':orderId')
    async delete(@Param('orderId', new ParseIdPipe()) orderId: string) {
        //TODO harddelete  return this.ordersService.delete(orderId);
        const order = await this.ordersService.getById(orderId);
        if (order == null) throw new NotFoundException('Order not found!');
        return order;
    }
}

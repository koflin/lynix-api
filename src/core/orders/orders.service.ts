import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EditOrderDto } from 'src/dto/order/editOrder.dto';
import { Order } from 'src/models/order.model';
import { User } from 'src/models/user.model';
import { OrderDoc } from 'src/schemas/order.schema';

import { MetadataService } from '../metadata/metadata.service';
import { ProductTemplatesService } from '../templates/product-templates/product-templates.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(OrderDoc.name) private orderModel: Model<OrderDoc>,
        private productTemplatesService: ProductTemplatesService,
        private metadataSerivce: MetadataService
    ) { }

    async getAll(filter: { companyId?: string, status: any }): Promise<Order[]> {
        const orderIds = await this.orderModel.find({ ...filter, deletedAt: { $exists: false } }, '_id').exec();
        return Promise.all(orderIds.map( async (doc) => {
            return this.getById(doc._id);
        }));
    }

    async getById(id: string): Promise<Order> {
        const orderDoc = await this.orderModel.findById(id).exec();
        
        if (orderDoc) {
            const productDocs = await Promise.all(orderDoc.products.map((product) => {
                return this.productTemplatesService.getById(product.templateId);
            }));
            return new Order(await this.metadataSerivce.get(orderDoc), orderDoc, productDocs);
        }

        return null;
    }

    async create(orderDto: EditOrderDto, user: User): Promise<Order> {
        const orderDoc = new this.orderModel(orderDto);
        orderDoc.companyId = user.companyId;
        await orderDoc.save();
        return this.getById(orderDoc._id);
    }

    async edit(id: string, orderDto: EditOrderDto): Promise<Order> {

        const orderDoc = await this.orderModel.findByIdAndUpdate(id, {
            ...orderDto,
        }, { new: true, omitUndefined: true }).exec();

        return this.getById(orderDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.orderModel.findByIdAndDelete(id).exec();
        return;
    }
}

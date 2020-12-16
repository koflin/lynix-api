import { Injectable, HttpService } from '@nestjs/common';
import { OrderDoc } from 'src/schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/models/order.model';
import { ProductTemplatesService } from '../templates/product-templates/product-templates.service';
import { EditOrderDto } from 'src/dto/order/editOrderDto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(OrderDoc.name) private orderModel: Model<OrderDoc>,
        private productTemplatesService: ProductTemplatesService
    ) { }

    async getAll(filter: { companyId?: string }): Promise<Order[]> {
        let orderIds = await this.orderModel.find(filter, '_id').exec();
        return Promise.all(orderIds.map( async (doc) => {
            return this.getById(doc._id);
        }));
    }

    async getById(id: string): Promise<Order> {
        let orderDoc = await this.orderModel.findById(id).exec();
        
        if (orderDoc) {
            let productDocs = await Promise.all(orderDoc.products.map((product) => {
                return this.productTemplatesService.getById(product.templateId);
            }));
            return new Order(orderDoc, productDocs);
        }

        return null;
    }

    async create(orderDto: EditOrderDto): Promise<Order> {
        let orderDoc = new this.orderModel(orderDto);
        await orderDoc.save();
        return this.getById(orderDoc.id);
    }

    async edit(id: string, orderDto: EditOrderDto): Promise<Order> {
        let orderDoc = await this.orderModel.findByIdAndUpdate(id, {
            ...orderDto,
        }, { new: true, omitUndefined: true });

        await orderDoc.save();
        return this.getById(orderDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.orderModel.findByIdAndDelete(id).exec();
        return;
    }
}

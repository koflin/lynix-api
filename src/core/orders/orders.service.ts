import { Injectable, HttpService } from '@nestjs/common';
import { OrderDoc } from 'src/schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/models/order.model';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(OrderDoc.name) private orderModel: Model<OrderDoc>, private http: HttpService) {
    }

    /*async getAll(filter: { companyId?: string }): Promise<Order[]> {
        let userDoc = await this.userModel.find(filter).exec();
        return userDoc.map(doc => new User(doc));
    }

    async getById(id: string): Promise<User> {
        let userDoc = await this.userModel.findById(id).exec();
        return userDoc == null ? null : new User(userDoc);
    }

    async create(orderDto: any): Promise<Order> {
        let orderDoc = new this.orderModel(orderDto);
        return new Order(await orderDoc.save());
    }*/
}

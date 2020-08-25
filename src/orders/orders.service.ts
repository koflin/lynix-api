import { Injectable, HttpService } from '@nestjs/common';
import { OrderDoc } from 'src/schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/models/order.model';
import { CreateOrderDto } from 'src/dto/order/createOrderDto';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(OrderDoc.name) private orderModel: Model<OrderDoc>, private http: HttpService) {
    }

    /*async getAll(filter: { companyId?: string }): Promise<User[]> {
        let userDoc = await this.userModel.find(filter).exec();
        return userDoc.map(doc => new User(doc));
    }

    async getById(id: string): Promise<User> {
        let userDoc = await this.userModel.findById(id).exec();
        return userDoc == null ? null : new User(userDoc);
    }*/

    async create(orderDto: CreateOrderDto): Promise<Order> {
        let orderData = {
            companyId: "0",
            status: "in_testing",
            name: "Testing Order",
            description: "A lot of tests",
            products: [
                {
                    name: "Test Product Type 1",
                    processes: [
                        {
                            name: "Test Process 1",
                            mainTasks: "-Code something\n-Test something\n",
                            previousComments: "I like this process",
                            estimatedTime: 36000,
                            timeTaken: 3000,
                            steps: [
                                {
                                    title: "Code something",
                                    materials: ["RedBull"],
                                    tools: ["Visual Studio Code", "Putty"],
                                    keyMessage: "Keep it going!",
                                    tasks: "1. Setup\n2. Code\n",
                                    prictureUris: ["https://google.com"],
                                    videoUris: ["https://youtube.com"],
                                    timeTaken: 1000
                                },
                                {
                                    title: "Test something",
                                    materials: ["RedBull"],
                                    tools: ["Visual Studio Code", "Postman"],
                                    keyMessage: "Find 'em bugs!",
                                    tasks: "1. Imagine data\n2. Test\n",
                                    prictureUris: ["https://google.com"],
                                    videoUris: ["https://youtube.com"],
                                    timeTaken: 2000
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        let orderDoc = new this.orderModel(orderData);
        return new Order(await orderDoc.save());
    }
}

import { ApiProperty } from "@nestjs/swagger";
import { OrderDoc } from "src/schemas/order.schema";
import { ProductTemplate } from "./productTemplate.model";
import * as moment from 'moment';

export class Order {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty()
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed';
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: object;
    @ApiProperty()
    deliveryDate: Date;

    @ApiProperty()
    products: {
        template: ProductTemplate;
        quantity: number;
    }[];

    constructor(order: OrderDoc, productTemplates: ProductTemplate[]) {
        this.id = order._id;
        this.companyId = order.companyId;
        this.status = order.status;
        this.name = order.name;
        this.description = order.description;
        this.deliveryDate = order.deliveryDate;

        this.products = order.products.map((prod, index) => {
            return {
                template: productTemplates[index],
                quantity: prod.quantity
            }
        });
    }
}
import { ApiProperty } from '@nestjs/swagger';
import { OrderDoc } from 'src/schemas/order.schema';

import { ProductTemplate } from './productTemplate.model';

export class Order {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty()
    status: OrderStatus;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: any;
    @ApiProperty()
    deliveryDate: Date;

    @ApiProperty()
    releasedAt: Date;
    @ApiProperty()
    startedAt: Date;
    @ApiProperty()
    completedAt: Date;

    @ApiProperty()
    products: {
        template: ProductTemplate;
        quantity: number;
    }[];

    constructor(order: OrderDoc, productTemplates: ProductTemplate[]) {
        this.id = order.id;
        this.companyId = order.companyId;
        this.status = order.status;
        this.name = order.name;
        this.description = order.description;
        this.deliveryDate = order.deliveryDate;

        this.releasedAt = order.releasedAt;
        this.startedAt = order.startedAt;
        this.completedAt = order.completedAt;

        this.products = order.products.map((prod, index) => {
            return {
                template: productTemplates[index],
                quantity: prod.quantity
            }
        });
    }
}

export type OrderStatus = 'in_preparation' | 'released' | 'in_progress' | 'completed';
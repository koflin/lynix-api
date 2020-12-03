import { ApiProperty } from "@nestjs/swagger";
import { OrderDoc } from "src/schemas/order.schema";
import { ProductTemplate } from "./productTemplate.model";

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
    description: string;

    @ApiProperty()
    products: {
        template: ProductTemplate;
        quantity: number;
    }[];

    constructor(order: OrderDoc) {
        this.id = order.id;
        this.companyId = order.companyId;
        this.name = order.name;
        this.description = order.description;
    }
}
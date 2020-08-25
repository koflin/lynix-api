import { ApiProperty } from "@nestjs/swagger";
import { OrderDoc } from "src/schemas/order.schema";
import { Product } from "./product.model";

export class Order {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    @ApiProperty()
    status: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    products: Product[];

    constructor(order: OrderDoc) {
        this.id = order.id;
        this.companyId = order.companyId;
        this.status = order.status;
        this.name = order.name;
        this.description = order.description;
        this.products = order.products.map(product => new Product(product));
    }
}
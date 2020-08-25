import { ApiProperty } from "@nestjs/swagger";
import { OrderDoc } from "src/schemas/order.schema";
import { ProductDoc } from "src/schemas/product.schema";
import { Process } from "./process.model";

export class Product {
    @ApiProperty()
    name: string;
    @ApiProperty()
    processes: Process[];

    constructor(product: ProductDoc) {
        this.name = product.name;
        this.processes = product.processes.map(process => new Process(process));
    }
}
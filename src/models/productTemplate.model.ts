import { ProductTemplateDoc } from './../schemas/productTemplate.schema';


import { ApiProperty } from "@nestjs/swagger";
import { ProcessTemplate } from "./processTemplate";

/**
 * Represents a Product Template object
 */
export class ProductTemplate {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    processes: {
        template: ProcessTemplate;
        quantity: number;
    }[];

    constructor(product: ProductTemplateDoc, processes: ProcessTemplate[]) {
        this.id = product._id;
        this.companyId = product.companyId;
        this.name = product.name;
        
        this.processes = product.processes.map((process, index) => {
            return {
                template: processes[index],
                quantity: process.quantity
            };
        });
    }
}
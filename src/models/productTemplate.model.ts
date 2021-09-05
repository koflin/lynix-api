import { ApiProperty } from '@nestjs/swagger';

import { ProductTemplateDoc } from './../schemas/productTemplate.schema';
import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';
import { ProcessTemplate } from './processTemplate';


/**
 * Represents a Product Template object
 */
export class ProductTemplate extends MetadataEntity {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: any;
    @ApiProperty()
    processes: {
        template: ProcessTemplate;
        quantity: number;
    }[];

    constructor(metadata: Metadata, product: ProductTemplateDoc, processes: ProcessTemplate[]) {
        super(metadata);

        this.id = product.id;
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
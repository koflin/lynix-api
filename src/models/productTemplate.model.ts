import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { ProductTemplateDoc } from './../schemas/productTemplate.schema';
import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';
import { ProcessTemplate } from './processTemplate';


/**
 * Represents a Product Template object
*/
@ObjectType()
export class ProductTemplate extends MetadataEntity {
    @ApiProperty()
    @Field(type => ID)
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: Object;
    @ApiProperty()
    processes: ProcessQuantityPair[];

    constructor(metadata: Metadata, product: ProductTemplateDoc, processes: ProcessTemplate[]) {
        super(metadata);

        this.id = product.id;
        this.companyId = product.companyId;
        this.name = product.name;
        
        this.processes = product.processes.map((process, index) => {
            return {
                template: processes[index],
                quantity: process.quantity,
            };
        });
    }
}

@ObjectType()
export class ProcessQuantityPair {
    template: ProcessTemplate;
    quantity: number;
}
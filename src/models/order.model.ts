import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { OrderDoc } from 'src/schemas/order.schema';

import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';
import { OrderStatus } from './enums/orderStatus.enum';
import { ProductTemplate } from './productTemplate.model';

@ObjectType()
export class Order extends MetadataEntity {
    @ApiProperty()
    @Field(type => ID)
    id: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty()
    status: OrderStatus;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: Object;
    @ApiProperty()
    deliveryDate: Date;

    @ApiProperty()
    releasedAt: Date;
    @ApiProperty()
    startedAt: Date;
    @ApiProperty()
    completedAt: Date;

    @ApiProperty()
    products: ProductQuantityPair[];

    constructor(metadata: Metadata, order: OrderDoc, productTemplates: ProductTemplate[]) {
        super(metadata);
        
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

@ObjectType()
export class ProductQuantityPair {
    template: ProductTemplate;
    quantity: number;
}
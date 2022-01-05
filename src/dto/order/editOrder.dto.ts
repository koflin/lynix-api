import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsIn,
    IsISO8601,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { OrderStatus } from 'src/models/enums/orderStatus.enum';

export class EditOrderDto {
    @ApiProperty()
    @IsOptional()
    @IsIn(Object.values(OrderStatus))
    status: OrderStatus;
    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string;
    @ApiProperty()
    @IsOptional()
    @IsObject()
    description: any;
    @ApiProperty()
    @IsOptional()
    @IsISO8601()
    deliveryDate: Date;

    @ApiProperty()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Product)
    products: Product[];
}

class Product {
    @IsNotEmpty()
    @IsMongoId()
    templateId: string;
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;
}
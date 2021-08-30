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

export class EditOrderDto {
    @ApiProperty()
    @IsOptional()
    @IsIn(['in_preparation', 'released', 'in_progress', 'completed'])
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed';
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
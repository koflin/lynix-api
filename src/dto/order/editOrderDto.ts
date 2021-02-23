import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDate, IsDateString, IsIn, IsISO8601, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
    description: object;
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
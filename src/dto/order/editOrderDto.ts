import { EditBaseDto } from './../base/editBase';
import { BaseDto } from './../base/baseDto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EditOrderDto extends EditBaseDto {
    @ApiProperty()
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed';
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: object;

    @ApiProperty()
    products: {
        templateId: string;
        quantity: number;
    }[];
}
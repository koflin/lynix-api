import { EditBaseDto } from './../base/editBase';
import { BaseDto } from './../base/baseDto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EditCompanyDto extends EditBaseDto {
    @ApiPropertyOptional()
    name?: string;
    @ApiPropertyOptional()
    logo?: string;
}
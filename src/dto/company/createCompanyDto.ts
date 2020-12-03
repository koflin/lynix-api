import { BaseDto } from './../base/baseDto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCompanyDto extends BaseDto {
    @ApiProperty()
    name: string;
    @ApiPropertyOptional()
    logo?: string;
}
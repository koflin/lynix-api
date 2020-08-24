import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EditCompanyDto {
    @ApiPropertyOptional()
    name?: string;
    @ApiPropertyOptional()
    logo?: string;
}
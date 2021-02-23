import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EditCompanyDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo?: string;
}
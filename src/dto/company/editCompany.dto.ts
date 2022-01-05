import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UrlDoc } from 'src/schemas/url.schema';

export class EditCompanyDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo?: UrlDoc;
}
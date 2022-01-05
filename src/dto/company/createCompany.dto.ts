import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UrlDoc } from 'src/schemas/url.schema';


export class CreateCompanyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo?: UrlDoc;
}
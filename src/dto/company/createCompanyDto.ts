import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateCompanyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo?: string;
}
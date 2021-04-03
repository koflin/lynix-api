import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    roleId?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatar?: string;
}
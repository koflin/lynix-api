import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UrlType } from 'src/models/url.type';
import { UrlDoc } from 'src/schemas/url.schema';

import { IsUrl } from '../decorators/url.decorator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    companyId: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;
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
    @IsUrl([UrlType.MEDIA])
    avatar?: UrlDoc;
}
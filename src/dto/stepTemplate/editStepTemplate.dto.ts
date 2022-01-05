import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { UrlType } from 'src/models/url.type';
import { UrlDoc } from 'src/schemas/url.schema';

import { IsUrl } from '../decorators/url.decorator';

export class EditStepTemplateDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    title: string;
    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    materials: string[];
    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    toolIds: string[];
    @ApiProperty()
    @IsOptional()
    @IsObject()
    keyMessage: any;
    @ApiProperty()
    @IsOptional()
    @IsObject()
    tasks: any;
    @ApiProperty()
    @IsOptional()
    @IsUrl([UrlType.MEDIA], { each: true })
    pictureUris?: UrlDoc[];
    @ApiProperty()
    @IsOptional()
    @IsUrl([UrlType.MEDIA], { each: true })
    videoUris?: UrlDoc[];
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    estimatedTime: number;
} 
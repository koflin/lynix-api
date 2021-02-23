import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, IsUrl, ValidateNested, IsObject } from 'class-validator';

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
    keyMessage: object;
    @ApiProperty()
    @IsOptional()
    @IsObject()
    tasks: object;
    @ApiProperty()
    @IsOptional()
    @IsUrl({}, { each: true })
    pictureUris?: string[];
    @ApiProperty()
    @IsOptional()
    @IsUrl({}, { each: true })
    videoUris?: string[];
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    estimatedTime: number;
} 
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { EditStepTemplateDto } from '../stepTemplate/editStepTemplate.dto';

export class EditProcessTemplateDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string;
    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    mainTasks: string[];
    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    previousComments?: string[];

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EditStepTemplateDto)
    steps: EditStepTemplateDto[];
}
import { ApiProperty } from '@nestjs/swagger';
import { EditBaseDto } from './../base/editBase';

export class EditStepTemplateDto extends EditBaseDto {
    @ApiProperty()
    title: string;
    @ApiProperty()
    materials: string[];
    @ApiProperty()
    toolIds: string[];
    @ApiProperty()
    keyMessage: string;
    @ApiProperty()
    tasks: string;
    @ApiProperty()
    pictureUris?: string[];
    @ApiProperty()
    videoUris?: string[];
    @ApiProperty()
    estimatedTime: number;
} 
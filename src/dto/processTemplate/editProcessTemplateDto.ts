import { ApiProperty } from '@nestjs/swagger';
import { EditStepTemplateDto } from '../stepTemplate/editStepTemplateDto';
import { EditBaseDto } from './../base/editBase';

export class EditProcessTemplateDto extends EditBaseDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    mainTasks: string[];
    @ApiProperty()
    previousComments?: string[];

    @ApiProperty()
    stepTemplates: EditStepTemplateDto[];
}
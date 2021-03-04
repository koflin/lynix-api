import { ApiProperty } from '@nestjs/swagger';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';

import { StepTemplate } from './stepTemplate.model';

export class ProcessTemplate {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    mainTasks: string[];
    @ApiProperty()
    previousComments?: string[];

    @ApiProperty()
    stepTemplates: StepTemplate[];

    constructor(process: ProcessTemplateDoc) {
        this.id = process.id;
        this.companyId = process.companyId;
        this.name = process.name;
        this.mainTasks = process.mainTasks;
        this.previousComments = process.previousComments;
        this.stepTemplates = process.stepTemplates.map(step => new StepTemplate(step));
    }
}
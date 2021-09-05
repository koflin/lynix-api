import { ApiProperty } from '@nestjs/swagger';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';

import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';
import { StepTemplate } from './stepTemplate.model';

export class ProcessTemplate extends MetadataEntity {
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
    steps: StepTemplate[];

    constructor(metadata: Metadata, process: ProcessTemplateDoc) {
        super(metadata);

        this.id = process.id;
        this.companyId = process.companyId;
        this.name = process.name;
        this.mainTasks = process.mainTasks;
        this.previousComments = process.previousComments;
        this.steps = process.steps.map(step => new StepTemplate(step));
    }
}
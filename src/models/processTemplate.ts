import { ProcessDoc } from './../schemas/process.schema';
import { ApiProperty } from "@nestjs/swagger";
import { StepTemplate } from "./stepTemplate.model";

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

    constructor(process: ProcessDoc, steps: StepTemplate[]) {
        this.id = process.id;
        this.companyId = process.companyId;
        this.name = process.name;
        this.mainTasks = process.mainTasks;
        this.previousComments = process.previousComments;
        this.stepTemplates = steps;
    }
}
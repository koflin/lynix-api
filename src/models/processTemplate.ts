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
}
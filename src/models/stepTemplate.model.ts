import { StepDoc } from 'src/schemas/step.schema';
import { ApiProperty } from "@nestjs/swagger";

export class StepTemplate {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
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

    constructor(step: StepDoc) {
        this.id = step.id;
        this.companyId = step.companyId;
        this.title = step.title;
        this.materials = step.materials;
        this.toolIds = step.toolIds;
        this.keyMessage = step.keyMessage;
        this.tasks = step.tasks;
        this.pictureUris = step.pictureUris;
        this.videoUris = step.videoUris;
        this.estimatedTime = step.estimatedTime;
    }
}
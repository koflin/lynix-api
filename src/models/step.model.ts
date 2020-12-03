import { ApiProduces, ApiProperty } from "@nestjs/swagger";
import { StepDoc } from "src/schemas/step.schema";

export class Step {
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
    pictureUris: string[];
    @ApiProperty()
    videoUris: string[];
    @ApiProperty()
    estimatedTime: number;
    
    @ApiProperty()
    timeTaken: number;

    constructor(step: StepDoc) {
        this.title = step.title;
        this.materials = step.materials;
        this.keyMessage = step.keyMessage;
        this.tasks = step.tasks;
        this.pictureUris = step.pictureUris;
        this.videoUris = step.videoUris;
        this.timeTaken = step.timeTaken;
    }
}
import { StepDoc } from './../schemas/step.schema';
import { ApiProduces, ApiProperty } from "@nestjs/swagger";

export class Step {    
    @ApiProperty()
    title: string;
    @ApiProperty()
    materials: string[];
    @ApiProperty()
    toolIds: string[];
    @ApiProperty()
    keyMessage: object;
    @ApiProperty()
    tasks: object;
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
        this.estimatedTime = step.estimatedTime;
        
        this.timeTaken = step.timeTaken;
    }
}
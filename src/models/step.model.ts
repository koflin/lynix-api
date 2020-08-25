import { ApiProduces, ApiProperty } from "@nestjs/swagger";
import { StepDoc } from "src/schemas/step.schema";

export class Step {
    @ApiProperty()
    title: string;
    @ApiProperty()
    materials: string[];
    @ApiProperty()
    tools: string[];
    @ApiProperty()
    keyMessage: string;
    @ApiProperty()
    tasks: string;
    @ApiProperty()
    pictureUris: string[];
    @ApiProperty()
    videoUris: string[];
    @ApiProperty()
    timeTaken: number;

    constructor(step: StepDoc) {
        this.title = step.title;
        this.materials = step.materials;
        this.tools = step.tools;
        this.keyMessage = step.keyMessage;
        this.tasks = step.tasks;
        this.pictureUris = step.pictureUris;
        this.videoUris = step.videoUris;
        this.timeTaken = step.timeTaken;
    }
}
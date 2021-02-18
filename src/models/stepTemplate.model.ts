import { ApiProperty } from "@nestjs/swagger";
import { ProcessTemplateDoc } from "src/schemas/processTemplate.schema";
import { StepTemplateDoc } from "src/schemas/stepTemplate.schema";

export class StepTemplate {
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

    constructor(stepTemplate: StepTemplate) {
        this.title = stepTemplate.title;
        this.materials = stepTemplate.materials;
        this.toolIds = stepTemplate.toolIds;
        this.keyMessage = stepTemplate.keyMessage;
        this.tasks = stepTemplate.tasks;
        this.pictureUris = stepTemplate.pictureUris;
        this.videoUris = stepTemplate.videoUris;
        this.estimatedTime = stepTemplate.estimatedTime;
    }
}
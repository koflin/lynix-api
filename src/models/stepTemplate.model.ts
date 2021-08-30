import { ApiProperty } from '@nestjs/swagger';

export class StepTemplate {
    @ApiProperty()
    title: string;
    @ApiProperty()
    materials: string[];
    @ApiProperty()
    toolIds: string[];
    @ApiProperty()
    keyMessage: any;
    @ApiProperty()
    tasks: any;
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
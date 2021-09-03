import { ApiProperty } from '@nestjs/swagger';
import { UrlDoc } from 'src/schemas/url.schema';

import { StepDoc } from './../schemas/step.schema';

export class Step {    
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
        this.pictureUris = step.pictureUris?.map(s => UrlDoc.to(s));
        this.videoUris = step.videoUris?.map(s => UrlDoc.to(s));
        this.estimatedTime = step.estimatedTime;
        
        this.timeTaken = step.timeTaken;
    }
}
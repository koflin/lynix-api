import { ApiProperty } from '@nestjs/swagger';
import { StepTemplateDoc } from 'src/schemas/stepTemplate.schema';
import { UrlDoc } from 'src/schemas/url.schema';

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

    constructor(stepTemplate: StepTemplateDoc) {
        this.title = stepTemplate.title;
        this.materials = stepTemplate.materials;
        this.toolIds = stepTemplate.toolIds;
        this.keyMessage = stepTemplate.keyMessage;
        this.tasks = stepTemplate.tasks;
        this.pictureUris = stepTemplate?.pictureUris?.map(url => UrlDoc.to(url));
        this.videoUris = stepTemplate?.videoUris?.map(url => UrlDoc.to(url));
        this.estimatedTime = stepTemplate.estimatedTime;
    }
}
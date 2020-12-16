import { ApiProperty } from "@nestjs/swagger";
import { ProcessTemplateDoc } from "src/schemas/processTemplate.schema";
import { StepTemplateDoc } from "src/schemas/stepTemplate.schema";

export class StepTemplate {

    /*@ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;*/
    
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

    constructor(stepDoc: StepTemplateDoc) {
        this.title = stepDoc.title;
        this.materials = stepDoc.materials;
        this.toolIds = stepDoc.toolIds;
        this.keyMessage = stepDoc.keyMessage;
        this.tasks = stepDoc.tasks;
        this.pictureUris = stepDoc.pictureUris;
        this.videoUris = stepDoc.videoUris;
        this.estimatedTime = stepDoc.estimatedTime;
    }
}
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
}
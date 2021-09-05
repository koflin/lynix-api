import { ApiProperty } from '@nestjs/swagger';
import { ToolDoc } from 'src/schemas/tool.schema';

import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';

export class Tool extends MetadataEntity {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    @ApiProperty()
    name: string;

    constructor(metadata: Metadata, tool: ToolDoc) {
        super(metadata);

        this.id = tool.id;
        this.companyId = tool.companyId;
        this.name = tool.name;
    }
}
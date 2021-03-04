import { ApiProperty } from '@nestjs/swagger';
import { ToolDoc } from 'src/schemas/tool.schema';

export class Tool {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    @ApiProperty()
    name: string;

    constructor(tool: ToolDoc) {
        this.id = tool.id;
        this.companyId = tool.companyId;
        this.name = tool.name;
    }
}
import { ToolDoc } from 'src/schemas/tool.schema';
import { ApiProperty } from "@nestjs/swagger";

export class Tool {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    @ApiProperty()
    name: string;

    constructor(tool: ToolDoc) {
        this.id = tool._id;
        this.companyId = tool.companyId;
        this.name = tool.name;
    }
}
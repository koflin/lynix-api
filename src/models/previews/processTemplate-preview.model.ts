import { ApiProperty } from '@nestjs/swagger';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';

export class ProcessTemplatePreview {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;

    constructor(process: ProcessTemplateDoc) {
        this.id = process.id;
        this.companyId = process.companyId;
        this.name = process.name;
    }
}
import { ApiProperty } from '@nestjs/swagger';
import { EditBaseDto } from './../base/editBase';

export class ProcessTemplate extends EditBaseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    mainTasks: string[];
    @ApiProperty()
    previousComments?: string[];

    @ApiProperty()
    stepTemplates: undefined[];
}
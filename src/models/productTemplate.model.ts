import { ApiProperty } from "@nestjs/swagger";
import { ProcessTemplate } from "./processTemplate";

export class ProductTemplate {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    processes: {
        template: ProcessTemplate;
        quantity: number;
    }[];
}
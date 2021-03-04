import { ApiProperty } from '@nestjs/swagger';
import { CompanyDoc } from 'src/schemas/company.schema';

export class Company {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    logo: string;

    constructor(company: CompanyDoc) {
        this.id = company.id;
        this.name = company.name;
        this.logo = company.logo;
    }
}
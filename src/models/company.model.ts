import { ApiProperty } from "@nestjs/swagger";

export class Company {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty({ required: false })
    logo: string;

    constructor(company: Partial<Company>) {
        Object.assign(this, company);
    }
}
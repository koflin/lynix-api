import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCompanyDto {
    @ApiProperty()
    name: string;
    @ApiPropertyOptional()
    logo?: string;
}
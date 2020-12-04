import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    companyId: string;
    @ApiProperty()
    username: string;
    @ApiPropertyOptional()
    firstName?: string;
    @ApiPropertyOptional()
    lastName?: string;
    @ApiPropertyOptional()
    roleId?: string;
    @ApiPropertyOptional()
    avatar?: string;
}
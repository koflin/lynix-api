import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EditUserDto {
    @ApiPropertyOptional()
    username?: string;
    @ApiPropertyOptional()
    password?: string;
    @ApiPropertyOptional()
    firstName?: string;
    @ApiPropertyOptional()
    lastName?: string;
    @ApiPropertyOptional()
    roleId?: string;
    @ApiPropertyOptional()
    avatar?: string;
}
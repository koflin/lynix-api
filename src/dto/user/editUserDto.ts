import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBase64, IsMongoId, IsOptional, IsString, IsUrl } from "class-validator";

export class EditUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsMongoId()
    roleId?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    avatar?: string;
}
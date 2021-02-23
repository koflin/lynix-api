import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBase64, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, isURL } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    companyId: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;
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
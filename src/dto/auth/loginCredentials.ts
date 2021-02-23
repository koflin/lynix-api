import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginCredentials {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}
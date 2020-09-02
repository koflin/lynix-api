import { ApiProperty } from "@nestjs/swagger";

export class LoginCredentials {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}
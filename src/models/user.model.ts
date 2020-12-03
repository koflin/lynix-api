import { ApiProperty } from "@nestjs/swagger";
import { UserDoc } from "src/schemas/user.schema";

export class User {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    username: string;
    @ApiProperty()
    firstName?: string;
    @ApiProperty()
    lastName?: string;
    @ApiProperty()
    roleId?: string;
    @ApiProperty()
    avatar?: string;

    constructor(user: UserDoc) {
        this.id = user._id;
        this.companyId = user.companyId;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.roleId = user.roleId;
        this.avatar = user.avatar;
    }
}
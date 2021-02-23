import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class Id {
    @ApiProperty()
    @IsMongoId()
    id: string;
}
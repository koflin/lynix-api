import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "./baseDto";

export class EditBaseDto extends BaseDto {
    @ApiProperty()
    id: string;
}
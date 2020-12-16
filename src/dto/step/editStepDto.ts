import { ApiProperty } from "@nestjs/swagger";
import { EditBaseDto } from "../base/editBase";

export class EditStepDto extends EditBaseDto {
    @ApiProperty()
    timeTaken: number;
}
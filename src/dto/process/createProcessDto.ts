import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../base/baseDto";
import { EditBaseDto } from "../base/editBase";
import { EditStepDto } from "../step/editStepDto";

export class CreateProcessDto extends EditBaseDto {
    @ApiProperty()
    orderId: string;
    @ApiProperty()
    templateId: string;
}
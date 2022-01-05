import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class EditStepDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    timeTaken: number;
}
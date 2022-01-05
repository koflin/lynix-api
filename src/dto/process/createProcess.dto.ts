import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateProcessDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    orderId: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    templateId: string;
}
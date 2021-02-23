import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class EditProductTemplateDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string;
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Process)
    processes: Process[];
}

class Process {
    @IsNotEmpty()
    @IsMongoId()
    templateId: string;
    @IsNumber()
    @Min(1)
    quantity: number;
}
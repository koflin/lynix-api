import { ApiProperty } from "@nestjs/swagger";
import { EditBaseDto } from "../base/editBase";
import { EditProcessTemplateDto } from "../processTemplate/editProcessTemplateDto";

export class EditProductTemplateDto extends EditBaseDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    processes: {
        templateId: string;
        quantity: number;
    }[];
}
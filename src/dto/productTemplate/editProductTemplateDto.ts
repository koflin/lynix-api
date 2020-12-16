import { EditProcessTemplateDto } from "../processTemplate/editProcessTemplateDto";

export class EditProductTemplateDto {
    id: string;
    companyId: string;
    
    name: string;
    processes: {
        template: EditProcessTemplateDto;
        quantity: number;
    }[];
}
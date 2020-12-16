/**
 * Represents a step template subdocument
 */
export class StepTemplateDoc {
    title: string;
    materials: string[];
    toolIds: string[];
    keyMessage: string;
    tasks: string;
    pictureUris?: string[];
    videoUris?: string[];
    estimatedTime: number;
}
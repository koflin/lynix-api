import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { StepTemplateDoc } from "./stepTemplate.schema";

/**
 * Represents a step subdocument
 */
export class StepDoc extends StepTemplateDoc {
    title: string;
    materials: string[];
    toolIds: string[];
    tasks: string;
    pictureUris: string[];
    videoUris: string[];
    estimatedTime: number;

    timeTaken: number;
}
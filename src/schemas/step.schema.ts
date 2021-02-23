import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { StepTemplateDoc } from "./stepTemplate.schema";

/**
 * Represents a step subdocument
 */
@Schema()
export class StepDoc extends StepTemplateDoc {
    @Prop()
    timeTaken: number;
}
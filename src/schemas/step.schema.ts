import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class StepDoc extends Document {
    @Prop()
    id: string;
    @Prop()
    companyId: string;

    @Prop()
    title: string;
    @Prop([String])
    materials: string[];
    @Prop([String])
    toolIds: string[];
    @Prop()
    keyMessage: string;
    @Prop()
    tasks: string;
    @Prop([String])
    pictureUris: string[];
    @Prop([String])
    videoUris: string[];
    @Prop()
    estimatedTime: number;

    @Prop()
    timeTaken: number;
}

export const StepSchema = SchemaFactory.createForClass(StepDoc);
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema()
export class StepDoc {
    @Prop()
    title: string;
    @Prop([String])
    materials: string[];
    @Prop([String])
    tools: string[];
    @Prop()
    keyMessage: string;
    @Prop()
    tasks: string;
    @Prop([String])
    pictureUris: string[];
    @Prop([String])
    videoUris: string[];
    @Prop()
    timeTaken: number;
}

export const StepSchema = SchemaFactory.createForClass(StepDoc);
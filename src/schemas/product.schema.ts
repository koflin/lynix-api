import { ProcessDoc } from "./process.schema";
import { SchemaFactory, Prop } from "@nestjs/mongoose";

export class ProductDoc {
    @Prop()
    name: string;
    @Prop([ProcessDoc])
    processes: ProcessDoc[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductDoc);
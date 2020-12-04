import { ProductTemplate } from './../../../models/productTemplate.model';
import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductTemplateDoc } from 'src/schemas/productTemplate.schema';
import { Model } from 'mongoose';

@Controller('templates/product')
export class ProductTemplatesController {
    constructor(@InjectModel(ProductTemplateDoc.name) private productModel: Model<ProductTemplateDoc>) {
    }

    async getAll(filter: { companyId?: string }): Promise<ProductTemplate[]> {
        let productDoc = await this.productModel.find(filter).exec();
        return productDoc.map(doc => new ProductTemplate(doc));
    }

    async getById(id: string): Promise<User> {
        let userDoc = await this.userModel.findById(id).exec();
        return userDoc == null ? null : new User(userDoc);
    }

    async getByUsername(username: string): Promise<UserDoc> {
        let userDoc = await this.userModel.findOne({ username }).exec();
        return userDoc == null ? null : userDoc;
    }

    async create(userDto: CreateUserDto): Promise<User> {
        let userDoc = new this.userModel(userDto);
        // Encryp password here later
        return new User(await userDoc.save());
    }

    async edit(id: string, userDto: EditUserDto): Promise<User> {
        let userDoc = await this.userModel.findByIdAndUpdate(id, {
            ...userDto,
        }, { new: true, omitUndefined: true });
        
        return userDoc == null ? null : new User(await userDoc.save());
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
        return;
    }
}

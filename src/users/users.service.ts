import { Injectable, HttpService } from '@nestjs/common';
import { UserDoc } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(UserDoc.name) private userModel: Model<UserDoc>, private http: HttpService) {
    }

    async getAll(filter: { companyId?: string }): Promise<User[]> {
        let userDoc = await this.userModel.find(filter).exec();
        return userDoc.map(doc => new User(doc));
    }

    async getById(id: string): Promise<User> {
        let userDoc = await this.userModel.findById(id).exec();
        return userDoc == null ? null : new User(userDoc);
    }

    async create(userDto: CreateUserDto): Promise<User> {
        let userDoc = new this.userModel(userDto);
        userDoc.passwordEncrypted = "TESTPW";
        return new User(await userDoc.save());
    }

    async edit(id: string, userDto: EditUserDto): Promise<User> {
        let userDoc = await this.userModel.findByIdAndUpdate(id, {
            ...userDto,
            passwordEncrypted: "TESTCHANGEPW"
        }, { new: true });
        
        return userDoc == null ? null : new User(await userDoc.save());
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
        return;
    }
}

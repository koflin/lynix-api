import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';
import { ActiveUser } from 'src/models/activeUser.model';
import { LocalUser } from 'src/models/localUser.model';
import { User } from 'src/models/user.model';
import { UserDoc } from 'src/schemas/user.schema';

import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
    constructor(@InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
        private roleService: RolesService
    ) {
    }

    private activeUsers = new Map<string, ActiveUser>();

    async getAll(filter: { companyId?: string }): Promise<User[]> {
        let userIds = await this.userModel.find(filter, '_id').exec();
        return Promise.all(userIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(id: string): Promise<User> {
        let userDoc = await this.userModel.findById(id).exec();
        return userDoc == null ? null : new User(userDoc, await this.roleService.getById(userDoc.roleId));
    }

    async getByUsername(username: string): Promise<UserDoc> {
        let userDoc = await this.userModel.findOne({ username }).exec();
        return userDoc == null ? null : userDoc;
    }

    async create(userDto: CreateUserDto): Promise<User> {
        let userDoc = new this.userModel(userDto);
        // Encryp password here later
        await userDoc.save()
        return this.getById(userDoc.id);
    }

    async edit(id: string, userDto: EditUserDto): Promise<User> {
        let userDoc = await this.userModel.findByIdAndUpdate(id, {
            ...userDto,
        }, { new: true, omitUndefined: true });
        
        return this.getById(userDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
        return;
    }

    setActive(user: LocalUser, client: Socket) {
        this.activeUsers.set(user.id, { user, client });
    }

    setInactive(client: Socket) {
        for (let [id, activeUser] of this.activeUsers) {
            if (activeUser.client.id == client.id) {
                this.activeUsers.delete(id);
            }
        }
    }

    getActive(user: User | string): ActiveUser {
        let id: string;

        if (user instanceof User) {
            id = user.id;
        } else {
            id = user;
        }

        if (this.activeUsers.has(id)) {
            return this.activeUsers.get(id);
        }

        return null;
    }

    isActive(userId: string) {
        return this.activeUsers.has(userId);
    }
}

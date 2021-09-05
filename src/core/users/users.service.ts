import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { EditService } from 'src/core/interfaces/edit-service.interface';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';
import { ActiveUser } from 'src/models/activeUser.model';
import { LocalUser } from 'src/models/localUser.model';
import { User, UserActivity, UserStatus } from 'src/models/user.model';
import { UserDoc } from 'src/schemas/user.schema';

import { ActivationService } from '../activation/activation.service';
import { CompaniesService } from '../companies/companies.service';
import { MetadataService } from '../metadata/metadata.service';
import { RolesService } from '../roles/roles.service';
import { Role } from './../../models/role.model';

@Injectable()
export class UsersService implements EditService {
    private readonly offlineAfter = 5000;

    constructor(@InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
        private roleService: RolesService,
        private activationService: ActivationService,
        private companyService: CompaniesService,
        private metadataService: MetadataService
    ) {
    }

    private activeUsers = new Map<string, ActiveUser>();

    async getAll(companyId?: string, roles?: Role[]): Promise<User[]> {
        const userIds = await this.userModel.find({
            companyId,
            roleId: roles ? { $in: roles.map(role => role.id) } : undefined
        }, '_id').exec();
        return Promise.all(userIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(id: string): Promise<User> {
        const userDoc = await this.userModel.findById(id).exec();
        return userDoc == null ? null : new User(userDoc, await this.metadataService.get(userDoc), await this.roleService.getById(userDoc.roleId), await this.companyService.getById(userDoc.companyId));
    }

    async getByEmail(email: string): Promise<UserDoc> {
        const userDoc = await this.userModel.findOne({ email }).exec();
        return userDoc == null ? null : userDoc;
    }

    async create(userDto: CreateUserDto): Promise<User> {
        const userDoc = new this.userModel(userDto);
        await this.activationService.create(userDoc.id, 'activation', userDoc.companyId);
        await userDoc.save();
        return this.getById(userDoc.id);
    }

    async edit(id: string, userDto: EditUserDto): Promise<User> {
        const userDoc = await this.userModel.findByIdAndUpdate(id, {
            ...userDto,
        }, { new: true, omitUndefined: true }).exec();
        
        return this.getById(userDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
        return;
    }

    async getActivity(id: string): Promise<{ activity: UserActivity, status: UserStatus }> {
        return this.userModel.findById(id, 'activity status').exec();
    }

    setActivity(id: string, activity: UserActivity) {
        return this.userModel.findByIdAndUpdate(id, {
            activity
        }, { new: true, omitUndefined: true }).exec();
    }

    // Manage offline users
    updateActivities() {
        this.userModel.find({ lastSeen: { $ne: null } }).exec().then((users) => {
            users.forEach((user) => {
                if (user.status == 'online' && Date.now() - user.lastSeen.valueOf() > this.offlineAfter) {
                    user.status = 'offline';
                    user.activity = 'idle';
                    user.save();

                    console.log('[' + moment().format('HH:mm:ss') + '] Offline: ' + user.email);
                }
            });
        });
    }
 
    setConnected(user: LocalUser, client: Socket) {
        this.activeUsers.set(user.id, { user, client });

        this.userModel.findById(user.id, (err, user) => {
            if (user.status == 'offline') {
                console.log('[' + moment().format('HH:mm:ss') + '] Now online: ' + user.email);
            }
        });

        this.userModel.findByIdAndUpdate(user.id, {
            lastSeen: null,
            status: 'online'
        }, { new: true, omitUndefined: true }).exec();
    }

    setDisconnected(client: Socket) {
        for (const [id, activeUser] of this.activeUsers) {
            if (activeUser.client.id == client.id) {
                this.activeUsers.delete(id);

                this.userModel.findByIdAndUpdate(id, {
                    lastSeen: new Date()
                }, { new: true, omitUndefined: true }).exec();
            }
        }
    }

    getConnected(user: User | string): ActiveUser {
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

    isConnected(userId: string) {
        return this.activeUsers.has(userId);
    }

    getIdFromSocket(client: Socket) {
        for (const [id, activeUser] of this.activeUsers) {
            if (activeUser.client.id == client.id) {
                return id;
            }
        }

        return null;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Permission } from 'src/models/role.model';
import { ActivationDoc } from 'src/schemas/activation.schema';
import { AdminDoc } from 'src/schemas/admin.schema';
import { UserDoc } from 'src/schemas/user.schema';

import { RolesService } from '../roles/roles.service';

@Injectable()
export class AccountService {

    constructor(
        @InjectModel(AdminDoc.name) private adminModel: Model<AdminDoc>,
        @InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
        private roleService: RolesService
    ) {

    }

    async getByCredentials(email: string, password: string, isAdmin: boolean) {
        let passwordExp: string;
        let account: {
            id: any;
            email: string;
            companyId?: string;
            permissions?: Permission[];
        };

        if (isAdmin) {
            const admin = await this.adminModel.findOne({ email }).exec();

            if (!admin) return null;

            passwordExp = admin.passwordEncrypted;

            account = {
                id: admin.id,
                email: admin.email,
            };
        } else {
            const user = await this.userModel.findOne({ email }).exec();

            if (!user) return null;

            const role = await this.roleService.getById(user.roleId);

            passwordExp = user.passwordEncrypted;

            account = {
                id: user.id,
                companyId: user.companyId,
                email: user.email,
                permissions: role.permissions
            };
        }

        if (!account) {
            return null;
        }

        if (passwordExp && (passwordExp === password || await bcrypt.compare(password, passwordExp))) {
            return account;
        }

        return null;
    }

    async getById(id: string, isAdmin: boolean) {
        if (isAdmin) {
            const admin = await this.adminModel.findById(id).exec();

            if (!admin) return null;

            return {
                id: admin.id,
                email: admin.email,
            };
        } else {
            const user = await this.userModel.findById(id).exec();
            const role = await this.roleService.getById(user.roleId);

            if (!user) return null;

            return {
                id: user.id,
                companyId: user.companyId,
                email: user.email,
                permissions: role.permissions
            };
        }
    }

    async canCreate(email: string) {
        if (await this.userModel.findOne({ email }).exec() !== null) {
            return false;
        }
        
        if (await this.adminModel.findOne({ email }).exec() !== null) {
            return false;
        }

        return true;
    }

    async activate(activation: ActivationDoc, password: string) {
        const userDoc = await this.userModel.findById(activation.userId);

        if (activation.type == 'activation') {
            userDoc.activatedAt = new Date();
        } else if (activation.type == 'reset') {
            userDoc.lastPasswordResetAt = new Date();
        } else {
            return false;
        }

        const rounds = 10;
        userDoc.passwordEncrypted = await bcrypt.hash(password, rounds);
        await userDoc.save();
        return true;
    }
}

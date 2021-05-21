import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activation, ActivationType } from 'src/models/activation.model';
import { ActivationDoc } from 'src/schemas/activation.schema';
import { UserDoc } from 'src/schemas/user.schema';

import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ActivationService {
    constructor(
        @InjectModel(ActivationDoc.name) private activationModel: Model<ActivationDoc>,
        @InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
        private accountService: AccountService,
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService
    ) {

    }

    async getById(id: string) {
        const activation = await this.activationModel.findById(id).exec();
        if (activation == null) return null;

        const user = await this.usersService.getById(activation.userId);
        
        return new Activation(activation, user);
    }

    async getByUserId(userId: string) {
        const id =  (await this.activationModel.findOne({ userId }, '_id').exec())?.id;
        return this.getById(id);
    }

    async getByEmail(email: string) {
        return this.getByUserId(await (await this.userModel.findOne({ email })).id);
    }

    async create(userId: string, type: ActivationType, companyId?: string) {
        const activation = new this.activationModel();
        activation.companyId = companyId;
        activation.userId = userId;
        activation.type = type;
        activation.code = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        return this.getById((await activation.save()).id);
    }

    async verify(id: string, code: string) {
        const activation = await this.activationModel.findById(id);
        if (!activation) return false;
        if (activation.code != code) return false;
        if (activation.validUntil && activation.validUntil.valueOf() < Date.now()) return false;

        return this.getById(activation.id);
    }

    async activate(id: string, code: string, password: string) {
        const activation = await this.verify(id, code);

        if (!activation) return false;

        const activationDoc = await this.activationModel.findById(activation.id).exec();

        if (!await this.accountService.activate(activationDoc, password)) return false;
        
        activationDoc.validUntil = new Date(0);
        await activationDoc.save();
        return true;
    }
}

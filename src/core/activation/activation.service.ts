import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activation } from 'src/models/activation.model';
import { ActivationDoc } from 'src/schemas/activation.schema';
import { UserDoc } from 'src/schemas/user.schema';

import { AccountService } from '../account/account.service';

@Injectable()
export class ActivationService {
    constructor(
        @InjectModel(ActivationDoc.name) private activationModel: Model<ActivationDoc>,
        @InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
        private accountService: AccountService
    ) {

    }

    async getById(id: string) {
        const activation = await this.activationModel.findById(id).exec();
        if (activation == null) return null;
        return new Activation(activation);
    }

    async getByUserId(userId: string) {
        const id =  (await this.activationModel.findOne({ userId }, '_id').exec())?.id;
        return this.getById(id);
    }

    async getByEmail(email: string) {
        return this.getByUserId(await (await this.userModel.findOne({ email })).id);
    }

    async create(userId: string, type: 'activation' | 'reset', companyId?: string) {
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

        return activation.userId;
    }

    async activate(id: string, code: string, password: string) {
        const activation = await this.activationModel.findById(id);
        if (!activation) return false;
        if (activation.code != code) return false;
        if (activation.validUntil && activation.validUntil.valueOf() < Date.now()) return false;

        this.accountService.activate(activation, password);
        
        activation.validUntil = new Date(0);
        await activation.save();
        return true;
    }
}

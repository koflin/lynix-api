import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activation } from 'src/models/activation.model';
import { ActivationDoc } from 'src/schemas/activation.schema';
import { UserDoc } from 'src/schemas/user.schema';

@Injectable()
export class ActivationService {
    constructor(
        @InjectModel(ActivationDoc.name) private activationModel: Model<ActivationDoc>,
        @InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
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

    async getByUsername(username: string) {
        return this.getByUserId(await (await this.userModel.findOne({ username })).id);
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

        const userDoc = await this.userModel.findById(activation.userId);

        if (activation.type == 'activation') {
            userDoc.activatedAt = new Date();
        } else if (activation.type == 'reset') {
            userDoc.lastPasswordResetAt = new Date();
        } else {
            return false;
        }

        userDoc.passwordEncrypted = password;
        await userDoc.save();
        activation.validUntil = new Date(0);
        await activation.save();
        return true;
    }
}

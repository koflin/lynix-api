import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activation } from 'src/models/activation.model';
import { ActivationDoc } from 'src/schemas/activation.schema';

import { UsersService } from '../users/users.service';

@Injectable()
export class ActivationService {
    constructor(
        @InjectModel(ActivationDoc.name) private activationModel: Model<ActivationDoc>,
        private usersService: UsersService
    ) {

    }

    async getById(id: string) {
        const activation = await this.activationModel.findById(id).exec();
        if (activation == null) return null;
        return new Activation(activation);
    }

    async getByUserId(userId: string) {
        const id =  (await this.activationModel.findOne({ userId }, '_id').exec())._id;
        return this.getById(id);
    }

    async getByUsername(username: string) {
        return this.getByUserId(await (await this.usersService.getByUsername(username)).id);
    }

    async create(userId: string, companyId: string) {
        const activation = new this.activationModel();
        activation.companyId = companyId;
        activation.userId = userId;
        activation.type = 'activation';
        activation.code = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        return this.getById((await activation.save()).id);
    }

    async activate(id: string, code: string, password: string) {
        const activation = await this.activationModel.findById(id);
        if (!activation) return false;
        if (activation.code != code) return false;
        
        return this.usersService.activate(activation.userId, password);
    }
}

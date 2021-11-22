import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDoc } from 'src/schemas/company.schema';
import { OrderDoc } from 'src/schemas/order.schema';
import { ProcessDoc } from 'src/schemas/process.schema';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';
import { RoleDoc } from 'src/schemas/role.schema';
import { StepDoc } from 'src/schemas/step.schema';
import { UserDoc } from 'src/schemas/user.schema';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
        @InjectModel(RoleDoc.name) private roleModel: Model<RoleDoc>,
        @InjectModel(CompanyDoc.name) private companyModel: Model<CompanyDoc>,
        @InjectModel(ProcessDoc.name) private processModel: Model<ProcessDoc>,
        @InjectModel(StepDoc.name) private stepModel: Model<StepDoc>,
        @InjectModel(ProcessTemplateDoc.name) private processTemplateModel: Model<ProcessTemplateDoc>,
        @InjectModel(OrderDoc.name) private orderModel: Model<OrderDoc>,
    ) {
    }

    async getUsers(companyId: string)  {
        const users = await this.userModel.find({ companyId }, 'firstName lastName status roleId').exec();
        return Promise.all(users.map(async (user) => {
            return {
                name: `${user.firstName} ${user.lastName}`,
                status: user.status,
                roleName: (await this.roleModel.findById(user.roleId, 'name').exec()).name
            };
        }));
    }

    async getProcessTime(companyId: string, from: Date, to: Date, templateId: string) {
        const processes = await this.processModel.find({ companyId, createdAt: { $gte: from, $lte: to }, templateId }, 'orderId name steps').exec();

        return Promise.all(processes.map(async (process) => {
            return {
                name: process.name,
                orderName: (await this.orderModel.findById(process.orderId, 'name').exec()).name,
                steps: process.steps.map((step) => {
                    return {
                        name: step.title,
                        timeTaken: step.timeTaken
                    };
                }),
            };
        }));
    }
}

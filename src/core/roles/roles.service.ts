import { RoleDoc } from 'src/schemas/role.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EditRoleDto } from 'src/dto/role/editRoleDto';
import { Model } from 'mongoose';
import { Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';

@Injectable()
export class RolesService {

    constructor(@InjectModel(RoleDoc.name) private roleModel: Model<RoleDoc>) {
    }

    async getAll(filter: { companyId: string; }) {
        let roleDoc = await this.roleModel.find(filter).exec();
        return roleDoc.map(doc => new Role(doc));
    }

    async getById(roleId: string) {
        let roleDoc = await this.roleModel.findById(roleId).exec();
        return roleDoc == null ? null : new Role(roleDoc);
    }

    async create(editRoleDto: EditRoleDto, user: User) {
        let roleDoc = new this.roleModel(editRoleDto);
        roleDoc.companyId = user.companyId;
        await roleDoc.save();
        return this.getById(roleDoc.id);
    }

    async edit(roleId: string, editRoleDto: EditRoleDto) {
        let roleDoc = await this.roleModel.findByIdAndUpdate(roleId, {
            ...editRoleDto
        }, { new: true, omitUndefined: true });
        
        return roleDoc == null ? null : new Role(await roleDoc.save());
    }

    async delete(roleId: string) {
        await this.roleModel.findByIdAndDelete(roleId).exec();
        return;
    }
}

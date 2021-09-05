import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EditRoleDto } from 'src/dto/role/editRoleDto';
import { Permission, Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { RoleDoc } from 'src/schemas/role.schema';

import { MetadataService } from '../metadata/metadata.service';

@Injectable()
export class RolesService {

    constructor(
        @InjectModel(RoleDoc.name) private roleModel: Model<RoleDoc>,
        private metadataSerivce: MetadataService
    ) {
    }

    async getAll(companyId?: string, permissions?: Permission[]) {
        const roleIds = await this.roleModel.find({ companyId, permissions }, '_id').exec();
        return Promise.all(roleIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(roleId: string) {
        const roleDoc = await this.roleModel.findById(roleId).exec();
        return roleDoc == null ? null : new Role(await this.metadataSerivce.get(roleDoc), roleDoc);
    }

    async create(editRoleDto: EditRoleDto, user: User) {
        const roleDoc = new this.roleModel(editRoleDto);
        roleDoc.companyId = user.companyId;
        await roleDoc.save();
        return this.getById(roleDoc.id);
    }

    async edit(roleId: string, editRoleDto: EditRoleDto) {
        const roleDoc = await this.roleModel.findByIdAndUpdate(roleId, {
            ...editRoleDto
        }, { new: true, omitUndefined: true });
        
        return roleDoc == null ? null : this.getById(roleId);
    }

    async delete(roleId: string) {
        return this.roleModel.findByIdAndDelete(roleId).exec();
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Metadata } from 'src/models/base/metadata.interface';
import { User } from 'src/models/user.model';
import { UserDoc } from 'src/schemas/user.schema';

import { MetadataDocument } from './../../schemas/base/metadata-document';

@Injectable()
export class MetadataService {

    constructor(
        @InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
    ) {}
    
    async get(doc: MetadataDocument): Promise<Metadata> {
        const { createdAt, createdBy, editedAt, editedBy, deletedAt, deletedBy } = doc;

        const createUserDoc = await this.userModel.findById(createdBy).exec();
        const editUserDoc = await this.userModel.findById(editedBy).exec();
        const deleteUserDoc = await this.userModel.findById(deletedBy).exec();

        return {
            createdAt,
            createdBy: createUserDoc ? new User(createUserDoc) : undefined,
            editedAt,
            editedBy: editUserDoc ? new User(editUserDoc) : undefined,
            deletedAt,
            deletedBy: deleteUserDoc ? new User(deleteUserDoc) : undefined
        };
    }
}

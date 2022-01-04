import { ObjectType } from '@nestjs/graphql';

import { User } from '../user.model';
import { Metadata } from './metadata.interface';

@ObjectType()
export class MetadataEntity implements Metadata {
    test: number;
    testString: string;

    createdAt: Date;
    createdBy: User;
    editedAt: Date;
    editedBy: User;
    deletedAt: Date;
    deletedBy: User;

    constructor(metadata: Metadata) {
        this.createdAt = metadata?.createdAt;
        this.createdBy = metadata?.createdBy;
        this.editedAt = metadata?.editedAt;
        this.editedBy = metadata?.editedBy;
        this.deletedAt = metadata?.deletedAt;
        this.deletedBy = metadata?.deletedBy;
    }
}
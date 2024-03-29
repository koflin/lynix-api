import { User } from '../user.model';
import { Metadata } from './metadata.interface';

export class MetadataEntity implements Metadata {
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
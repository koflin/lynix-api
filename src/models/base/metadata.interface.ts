import { User } from '../user.model';

export interface Metadata {
    createdAt?: Date;
    createdBy?: User;
    editedAt?: Date;
    editedBy?: User;
    deletedAt?: Date;
    deletedBy?: User;
}
import { ApiProperty } from '@nestjs/swagger';
import { ActivationDoc } from 'src/schemas/activation.schema';

import { User } from './user.model';

export class Activation {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty()
    user: User;

    @ApiProperty()
    code: string;
    @ApiProperty()
    type: ActivationType;

    @ApiProperty()
    validUntil: Date;

    constructor(activation: ActivationDoc, user: User) {
        this.id = activation.id;
        this.companyId = activation.companyId;
        this.user = user;
        this.code = activation.code;
        this.type = activation.type;
        this.validUntil = activation.validUntil;
    }
}

export type ActivationType = 'activation' | 'reset';
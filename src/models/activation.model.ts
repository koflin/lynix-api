import { ApiProperty } from '@nestjs/swagger';
import { ActivationDoc } from 'src/schemas/activation.schema';

import { Account } from './account';

export class Activation {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty()
    account: Account;

    @ApiProperty()
    code: string;
    @ApiProperty()
    type: ActivationType;

    @ApiProperty()
    validUntil: Date;

    constructor(activation: ActivationDoc, account: Account) {
        this.id = activation.id;
        this.companyId = activation.companyId;
        this.account = account;
        this.code = activation.code;
        this.type = activation.type;
        this.validUntil = activation.validUntil;
    }
}

export type ActivationType = 'activation' | 'reset';
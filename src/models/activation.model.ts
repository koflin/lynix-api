import { ApiProperty } from '@nestjs/swagger';
import { ActivationDoc } from 'src/schemas/activation.schema';

export class Activation {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    userId: string;
    @ApiProperty()
    code: string;
    @ApiProperty()
    type: ActivationType;

    constructor(activation: ActivationDoc) {
        this.id = activation.id;
        this.companyId = activation.companyId;
        this.userId = activation.userId;
        this.code = activation.code;
        this.type = activation.type;
    }
}

export type ActivationType = 'activation' | 'reset';
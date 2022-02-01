import { registerEnumType } from '@nestjs/graphql';

export enum ProcessStatus {
    IN_PREPARATION = 'IN_PREPARATION',
    RELEASED = 'RELEASED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ASSISTANCE_REQUIRED = 'ASSISTANCE_REQUIRED'
};

registerEnumType(ProcessStatus, {
    name: 'ProcessStatus'
});
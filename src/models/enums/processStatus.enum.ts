import { registerEnumType } from '@nestjs/graphql';

export enum ProcessStatus {
    IN_PREPARATION = 'in_preparation',
    RELEASED = 'released',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    ASSISTANCE_REQUIRED = 'assistance_required'
};

registerEnumType(ProcessStatus, {
    name: 'ProcessStatus'
});
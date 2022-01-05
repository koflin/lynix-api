import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
    IN_PREPARATION = 'in_preparation',
    RELEASED = 'released',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

registerEnumType(OrderStatus, {
    name: 'OrderStatus'
});
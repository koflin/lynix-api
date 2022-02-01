import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
    IN_PREPARATION = 'IN_PREPARATION',
    RELEASED = 'RELEASED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

registerEnumType(OrderStatus, {
    name: 'OrderStatus'
});
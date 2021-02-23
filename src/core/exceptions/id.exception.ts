import { NotFoundException } from '@nestjs/common';

/**
 * @deprecated
 */
export class IdException extends NotFoundException {
    constructor(resource: string) {
        super(resource + ' not found!');
    }
}
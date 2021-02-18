import { NotFoundException } from '@nestjs/common';

export class IdException extends NotFoundException {
    constructor(resource: string) {
        super(resource + ' not found!');
    }
}
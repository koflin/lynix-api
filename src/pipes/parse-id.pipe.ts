import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.validate(value)) {
      throw new BadRequestException('Param "' + metadata.data + '" is not valid mongodb id!');
    }
    return value;
  }

  private validate(value: string): boolean {
    return Types.ObjectId.isValid(value);
  }
}

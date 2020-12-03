import { ApiProperty } from '@nestjs/swagger';
export class BaseDto {
    @ApiProperty()
    companyId: string;
}
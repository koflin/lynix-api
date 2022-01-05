import { ArgsType } from '@nestjs/graphql';

import { PaginationDto } from '../pagination/pagination.dto';

@ArgsType()
export class GetProcessesDto extends PaginationDto {
    assignedUserId?: string;
    orderId?: string;
}
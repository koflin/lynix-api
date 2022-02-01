import { ArgsType } from '@nestjs/graphql';
import { ProcessStatus } from 'src/models/enums/processStatus.enum';

import { PaginationDto } from '../pagination/pagination.dto';

@ArgsType()
export class GetProcessesDto extends PaginationDto {
    assignedUserId?: string;
    orderId?: string;
    status?: ProcessStatus;
}
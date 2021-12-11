import { Controller, Get, ParseArrayPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderStatus } from 'src/models/enums/orderStatus.enum';
import { ProcessStatus } from 'src/models/enums/processStatus.enum';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';

import { Account } from '../auth/account.decorator';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { StatisticsService } from './statistics.service';

@ApiTags('statistics')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('statistics')
export class StatisticsController {

    constructor(
        private statisticService: StatisticsService
    ) {
    }

    @Permissions(Permission.STATISTIC_VIEW)
    @Get('users')
    getUsers(@Account() user: User) {
        return this.statisticService.getUsers(user.companyId);
    }

    @Permissions(Permission.STATISTIC_VIEW)
    @Get('processes/time')
    getProcessTimes(@Account() user: User, @Query('from') from: Date, @Query('to') to: Date, @Query('templateId') templateId: string,  @Query('status', new ParseArrayPipe({ separator: ',', optional: true })) status?: ProcessStatus[]) {
        return this.statisticService.getProcessTime(user.companyId, from, to, templateId, status);
    }

    @Permissions(Permission.STATISTIC_VIEW)
    @Get('orders/time')
    async getOrderTimes(@Account() user: User, @Query('from') from: Date, @Query('to') to: Date, @Query('status', new ParseArrayPipe({ separator: ',', optional: true })) status?: OrderStatus[]) {
        return this.statisticService.getOrderTimes(user.companyId, from, to, status);
    }

    /*@Permissions(Permission.STATISTIC_VIEW)
    @Get('products/time')
    getProductTimes(@Account() user: User) {
        return;
    }*/
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Account = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.account;
    },
);
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Account = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);

        switch(ctx.getType()) {
            case 'http':
                return ctx.switchToHttp().getRequest()?.account;

            case 'graphql':
                return ctx.getContext().req?.account;

            default:
                return null;
        }
    },
);
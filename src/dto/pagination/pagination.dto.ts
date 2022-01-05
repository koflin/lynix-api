import { ArgsType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@ArgsType()
export class PaginationDto {
    @IsInt()
    @Min(0)
    offset: number;
    @IsInt()
    @Min(0)
    limit: number;
}
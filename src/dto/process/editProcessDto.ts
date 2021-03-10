import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class EditProcessDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    currentStepIndex: number;
    @ApiProperty()
    @IsOptional()
    @IsIn(['in_preparation', 'released', 'in_progress', 'completed', 'assistance_required'])
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed' | 'assistance_required';
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isOccupied: boolean;
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isRunning: boolean;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    assignedUserId: string;
}
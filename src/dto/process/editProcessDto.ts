import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../base/baseDto";
import { EditBaseDto } from "../base/editBase";
import { EditStepDto } from "../step/editStepDto";

export class EditProcessDto extends EditBaseDto {
    @ApiProperty()
    timeTaken: number;
    @ApiProperty()
    currentStepIndex: number;
    @ApiProperty()
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed' | 'assistance_required';
    @ApiProperty()
    isOccupied: boolean;
    @ApiProperty()
    isRunning: boolean;

    @ApiProperty()
    assignedUserId: string;

    @ApiProperty()
    steps: EditStepDto[];
}
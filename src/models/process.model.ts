import { ApiProperty } from "@nestjs/swagger";
import { ProcessTemplate } from "./processTemplate";
import { Step } from "./step.model";

export class Process {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty()
    orderId: string;
    @ApiProperty()
    template: ProcessTemplate;

    @ApiProperty()
    name: string;
    @ApiProperty()
    mainTasks: string[];
    @ApiProperty()
    previousComments: string;
    @ApiProperty()
    estimatedTime: number;

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
    steps: Step[];

    constructor(process: Process) {
        this.name = process.name;
        this.mainTasks = process.mainTasks;
        this.previousComments = process.previousComments;
        this.estimatedTime = process.estimatedTime;
        this.timeTaken = process.timeTaken;
    }
}
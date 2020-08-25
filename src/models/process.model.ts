import { ApiProperty } from "@nestjs/swagger";
import { Step } from "./step.model";

export class Process {
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
    steps: Step[];

    constructor(process: Process) {
        this.name = process.name;
        this.mainTasks = process.mainTasks;
        this.previousComments = process.previousComments;
        this.estimatedTime = process.estimatedTime;
        this.timeTaken = process.timeTaken;
        this.steps = process.steps.map(step => new Step(step));
    }
}
import { Logger } from "@nestjs/common";
import { ITimer } from "src/common/application/timer/timer.interface";

export class NestTimer implements ITimer {
    constructor(){}
    getTime(): number {
        return performance.now()
    }
}

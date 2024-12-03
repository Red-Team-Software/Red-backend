import { ITimer } from "src/common/application/timer/timer.interface";

export class NestTimer implements ITimer {
    private readonly performer:Performance
    constructor(){
        this.performer=new Performance()
    }
    getTime(): number {
        return this.performer.now()
    }
}

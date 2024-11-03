import { Logger } from "@nestjs/common";
import { ILogger } from "src/common/application/logger/logger.interface";

export class NestLogger implements ILogger {
    constructor(private readonly logger:Logger){}
    errorLog(serviceName: string, message: string, input: string): void {
        this.logger.error(message + input, serviceName);
    }
    successLog(serviceName: string, message: string, input: string): void {
        this.logger.log(message + input, serviceName);
    }

}
import { Logger } from "@nestjs/common";
import { ILogger } from "src/common/application/logger/logger.interface";

export class NestLogger implements ILogger {

    errorLog(serviceName: string, message: string, input: string): void {
        Logger.error(message + input, serviceName);
    }
    successLog(serviceName: string, message: string, input: string): void {
        Logger.log(message + input, serviceName);
    }

}
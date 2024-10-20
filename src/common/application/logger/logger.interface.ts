export interface ILogger {
    errorLog (serviceName: string, message: string, input: string): void;
    successLog (serviceName: string, message: string, input: string): void;
}
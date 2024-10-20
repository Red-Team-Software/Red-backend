export abstract class IAsyncLogger {
  constructor(protected filePath: string){}

  abstract writeToLog(data: string): Promise<void>;
}
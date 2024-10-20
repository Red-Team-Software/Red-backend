import { IAsyncLogger } from "src/common/application/ports/IAsyncLogger";
import * as fsPromise from "fs/promises";

export class FsPromiseLogger extends IAsyncLogger {

  async writeToLog(data: string): Promise<void> {
    return fsPromise.appendFile(this.filePath, data + "\n", "utf-8");
  }
}
import { ITransactionHandler } from "src/common/domain";
import { QueryRunner } from "typeorm";

export class TransactionHandler implements ITransactionHandler {
    constructor(
       private readonly runner: QueryRunner
    ) {}
    async startTransaction(): Promise<void> {
        return await this.runner.startTransaction()
    }
    async commitTransaction(): Promise<void> {
        await this.runner.commitTransaction()
    }
    async rollbackTransaction(): Promise<void> {
        return await this.runner.rollbackTransaction()
    }

}
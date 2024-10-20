import { ITransactionHandler } from "src/common/domain/transaction-handler/transaction-handler.interface";
import { QueryRunner } from "typeorm";

export class TransactionHandler implements ITransactionHandler {

    private readonly runner: QueryRunner;

    constructor(runner: QueryRunner) {
        this.runner = runner;
    }

    async startTransaction(): Promise<void> {
        return this.runner.startTransaction();
    }
    
    async commitTransaction(): Promise<void> {
        this.runner.commitTransaction();
    }

    async rollbackTransaction(): Promise<void> {
        this.runner.rollbackTransaction()
    }

    getRunner(): QueryRunner {
        return this.runner;
    }

}
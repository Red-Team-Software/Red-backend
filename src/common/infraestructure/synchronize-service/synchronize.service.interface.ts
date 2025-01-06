import { Result } from "src/common/utils/result-handler/result";

export interface ISynchronizeService<T> {
    execute(event: T): Promise<Result<void>>
}
import { Result } from "src/common/utils/result-handler/result";

export interface ISycnchronizeService<T,E> {
    execute(event: T): Promise<Result<E>>
}
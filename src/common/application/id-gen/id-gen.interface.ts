export interface IIdGen {
    genId(): Promise<string>;
}
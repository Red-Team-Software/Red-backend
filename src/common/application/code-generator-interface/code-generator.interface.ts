export interface ICodeGenerator<T> {
    generateCode(length: number): T
    getRandomIntInRange(min: number, max: number): T
}
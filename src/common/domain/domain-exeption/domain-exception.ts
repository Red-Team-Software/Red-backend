export abstract class DomainException extends Error {
    constructor(msg: string) {
        super(msg);
        // Object.setPrototypeOf(this, DomainException.prototype);
    }
}
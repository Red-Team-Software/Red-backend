import { IDateHandler } from "src/common/application/date-handler/date-handler.interface";

export class TimeDateHandler implements IDateHandler{
    getExpiry(): Date {
        throw new Error("Method not implemented.");
    }
    isExpired(expiry: Date): boolean {
        throw new Error("Method not implemented.");
    }
    currentDate(): Date {
        throw new Error("Method not implemented.");
    }
}
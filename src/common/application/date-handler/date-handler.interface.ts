
export interface IDateHandler {
    getExpiry(): Date
    isExpired( expiry: Date ): boolean
    currentDate(): Date
}
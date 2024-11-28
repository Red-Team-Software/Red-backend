import * as moment from 'moment'
import * as momentTz from 'moment-timezone'

import { IDateHandler } from "src/common/application/date-handler/date-handler.interface";

export class DateHandler implements IDateHandler{
    currentDate(): Date {
        const fechaUTC = momentTz().tz('America/Caracas').toDate();
        return fechaUTC  
    }

    getExpiry() {
        const fechaUTC = momentTz().tz('America/Caracas').add(4, "days").toDate();
        return fechaUTC
    }

    isExpired( expiry: Date ) {
        const expirationDate = new Date(expiry)
        const currentDate = new Date(momentTz().tz('America/Caracas').toDate())
        return expirationDate.getTime() <= currentDate.getTime()
    }
}
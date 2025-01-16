import { Message } from 'src/common/application/events/message/message';

export class CourierAccountRegistered extends Message {
    serialize(): string {
        let data= {
            courierId: this.courierId,
            courierName: this.courierName,
            courierImage: this.courierImage,
            courierDirection: {
                lat: this.lat,
                long: this.long
            },
            email: this.email,
            password: this.password
        }
        return JSON.stringify(data)
    }
    static create(
        courierId: string,
        courierName: string,
        courierImage: string,
        lat: number,
        long: number,
        email: string,
        password: string
    ){
        return new CourierAccountRegistered(
            courierId,
            courierName,
            courierImage,
            lat,
            long,
            email,
            password
        )
    }
    constructor(
        public courierId: string,
        public courierName: string,
        public courierImage: string,
        public lat: number,
        public long: number,
        public email: string,
        public password: string
    ){
        super()
    }
}
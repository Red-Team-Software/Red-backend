import { ValueObject } from "src/common/domain";
import { EmptyCourierNameException } from "../exceptions/empty-courier-name.exception";


export class CourierName extends ValueObject<CourierName> {
    private name: string;

    private constructor(name: string) {
        super();

        if (name.length == 0 ){
            throw new EmptyCourierNameException();
        }

        this.name = name;
    }

    equals(obj: CourierName): boolean {
        return this.name == obj.name;
    }

    get courierName() {
        return this.name;
    }

    public static create(name: string): CourierName {
        return new CourierName(name);
    }
}
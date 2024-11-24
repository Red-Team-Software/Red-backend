import { ValueObject } from "src/common/domain";
import { InvalidCourierIdException } from "../exceptions/invalid-courier-id-form.eception";

export class CourierId extends ValueObject<CourierId> {
    private id: string;

    private constructor(id: string) {
        super();

        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidCourierIdException() }

        this.id = id;
    }

    equals(obj: CourierId): boolean {
        return this.id == obj.id;
    }

    get courierId() {
        return this.id;
    }

    public static create(id: string): CourierId {
        return new CourierId(id);
    }
}
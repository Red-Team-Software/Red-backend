import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { ValueObject } from "src/common/domain";

export class OrderBundleId extends ValueObject<OrderBundleId> {
    private id: BundleId;

    private constructor(id: BundleId) {
        super();

        //if(!id) { throw new EmptyOrderBundleIdException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.id = id;
    }

    equals(obj: OrderBundleId): boolean {
        return this.id == obj.id;
    }

    get OrderBundleId() {
        return this.id;
    }

    public static create(id: BundleId): OrderBundleId {
        return new OrderBundleId(id);
    }
}
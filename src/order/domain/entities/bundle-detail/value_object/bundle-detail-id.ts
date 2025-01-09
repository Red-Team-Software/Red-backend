import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { ValueObject } from "src/common/domain";

export class BundleDetailId extends ValueObject<BundleDetailId> {
    private id: string;

    private constructor(id: string) {
        super();

        //if(!id) { throw new EmptyOrderBundleIdException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.id = id;
    }

    equals(obj: BundleDetailId): boolean {
        return this.id == obj.id;
    }

    get BundleDetailId() {
        return this.id;
    }

    public static create(id: string): BundleDetailId {
        return new BundleDetailId(id);
    }
}
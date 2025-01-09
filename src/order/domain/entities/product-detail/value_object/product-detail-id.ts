import { ValueObject } from "src/common/domain";

export class ProductDetailId extends ValueObject<ProductDetailId> {
    private id: string;

    private constructor(id: string) {
        super();
        this.id = id;
    }

    equals(obj: ProductDetailId): boolean {
        return this.id == obj.id;
    }

    get productDetailId() {
        return this.id;
    }

    public static create(id: string): ProductDetailId {
        return new ProductDetailId(id);
    }
}
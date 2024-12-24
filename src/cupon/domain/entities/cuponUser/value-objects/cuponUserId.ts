import { ValueObject } from "src/common/domain";

export class CuponUserId implements ValueObject<CuponUserId> {
    private readonly id: string;

    private constructor(id: string) {
        this.id = id;
    }

    static create(userId: string, cuponId: string): CuponUserId {
        if (!userId || !cuponId) {
            throw new Error('Both userId and cuponId must be provided to create CuponUserId.');
        }

        const combinedId = `${userId}:${cuponId}`;
        return new CuponUserId(combinedId);
    }

    equals(other: CuponUserId): boolean {
        return this.id === other.id;
    }

    get Value(): string {
        return this.id;
    }
}

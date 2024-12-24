import { Entity } from "src/common/domain";
import { CuponUserId } from "./value-objects/cuponUserId";
import { UserId } from "src/user/domain/value-object/user-id";
import { CuponId } from "../../value-object/cupon-id";

export class CuponUser extends Entity<CuponUserId> {
    private isUsed: boolean;
    private userId: string;
    private cuponId: string;

    constructor(
        private cuponUserId: CuponUserId,
        userId: string,
        cuponId: string,
        isUsed: boolean = false
    ) {
        super(cuponUserId);
        this.isUsed = isUsed;
        this.cuponId=cuponId;
        this.userId=userId;
    }

    static create(userId: string, cuponId: string): CuponUser {
        
        const cuponUserId = CuponUserId.create(userId, cuponId);
        return new CuponUser(cuponUserId, userId, cuponId);
    }

    public markAsUsed(): void {
        this.isUsed = true;
    }

    public isCuponUsed(): boolean {
        return this.isUsed;
    }

    get CuponUserId(): CuponUserId {
        return this.cuponUserId;
    }

    get UserId(): string{
        return this.UserId;
    }

    get CuponId(): string{
        return this.cuponId;
    }
}

import { ValueObject } from "src/common/domain";

export enum CuponState {
    ACTIVE = "active",
    USED = "used"
}

export class CuponUserStateEnum implements ValueObject<CuponUserStateEnum> {
    constructor(private readonly state: CuponState) {}

    static create(state: string): CuponUserStateEnum {
        // Validar que el estado esté dentro de los valores definidos en CuponState
        if (!Object.values(CuponState).includes(state as CuponState)) {
            throw new Error(`Invalid cupon state: ${state}. Must be one of: ${Object.values(CuponState).join(', ')}`);
        }

        return new CuponUserStateEnum(state as CuponState);
    }
    equals(other: CuponUserStateEnum): boolean {
        return this.state === other.state;
    }

    getState(): CuponState {
        return this.state;
    }

    get Value(): string {
        return this.state.toString();
    }
}
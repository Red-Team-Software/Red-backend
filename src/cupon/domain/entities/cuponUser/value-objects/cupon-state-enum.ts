import { ValueObject } from "src/common/domain";

export enum EnumCuponState {
    ACTIVE = "active",
    USED = "used"
}

export class CuponUserStateEnum implements ValueObject<CuponUserStateEnum> {
    constructor(private readonly state: EnumCuponState) {}

    static create(state: string): CuponUserStateEnum {
        // Validar que el estado esté dentro de los valores definidos en CuponState
        if (!Object.values(EnumCuponState).includes(state as EnumCuponState)) {
            throw new Error(`Invalid cupon state: ${state}. Must be one of: ${Object.values(EnumCuponState).join(', ')}`);
        }

        return new CuponUserStateEnum(state as EnumCuponState);
    }
    equals(other: CuponUserStateEnum): boolean {
        return this.state === other.state;
    }

    getState(): EnumCuponState {
        return this.state;
    }

    get Value(): string {
        return this.state.toString();
    }
}
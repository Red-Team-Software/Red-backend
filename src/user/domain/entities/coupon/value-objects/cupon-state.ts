import { ValueObject } from "src/common/domain";
import { CuponUserStateEnum } from "./enum/cupon-user-state.enum";
import { InvalidCuponUserStateException } from "../domain-exceptions/invalid-cupon-user-state-exception";
import { InvalidCuponUserAlreadyUsedException } from "../domain-exceptions/invalid-cupon-user-already-used-exception";

export class CuponState implements ValueObject<CuponState> {
    private readonly state: string;

    equals(valueObject: CuponState): boolean {
        return this.Value === valueObject.Value;
    }

    get Value() {
        return this.state;
    }

    static create(state: string): CuponState {
        return new CuponState(state);
    }

    private constructor(state: string) {
        if (!CuponUserStateEnum[state]) 
            throw new InvalidCuponUserStateException(state);
        this.state = state;
    }

    changeUsed():CuponState{
        if(this.state===CuponUserStateEnum.used)
            throw new InvalidCuponUserAlreadyUsedException()
        return new CuponState(CuponUserStateEnum.used)
    }

    verifyIsUsed(){
        if(this.state === CuponUserStateEnum.used)
            throw new InvalidCuponUserAlreadyUsedException()
        return
    }
}

import { Ballance } from "../../entities/wallet/value-objects/balance";
import { IConvertBallance } from "../interfaces/convert-ballance.interface";

export class CalculateBallanceService{

    constructor(private readonly convert:IConvertBallance){}

    async calculate(b:Ballance):Promise<Ballance>{
        return this.convert.calculate(b)
    }
}
import { Ballance } from "../../entities/wallet/value-objects/balance";

export interface IConvertBallance{
    calculate(b:Ballance):Promise<Ballance>
}
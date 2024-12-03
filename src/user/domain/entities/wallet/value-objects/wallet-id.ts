import { ValueObject } from "src/common/domain"
import { InvalidWalletIdException } from "../domain-exceptions/invalid-wallet-id-exception"

export class WalletId implements ValueObject<WalletId> {

    private readonly id: string

    equals(valueObject: WalletId): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): WalletId {
        return new WalletId( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidWalletIdException() }
        this.id=id
    }

}
import { ValueObject } from "src/common/domain"
import { InvalidUserIdException } from "../domain-exceptions/invalid-user-id-exception copy"

export class UserId implements ValueObject<UserId> {

    private readonly id: string

    equals(valueObject: UserId): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): UserId {
        return new UserId( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        if (!regex.test(id)) { throw new InvalidUserIdException() }
        this.id=id
    }

}
import { ValueObject } from "src/common/domain"
import { InvalidUserDirectionNameException } from "src/user/domain/domain-exceptions/invalid-user-direction-name-exception"

export class DirectionName implements ValueObject<DirectionName> {

    private readonly name: string

    equals(valueObject: DirectionName): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.name }

    static create ( name: string ): DirectionName {
        return new DirectionName( name )
    }

    private constructor(name:string){
        const regex = new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{1,50}$/)      
        if (!regex.test(name)) 
            throw new InvalidUserDirectionNameException(name)
        this.name=name
    }

    changeName(name:DirectionName):DirectionName{
        return DirectionName.create(name.Value)
    }

}
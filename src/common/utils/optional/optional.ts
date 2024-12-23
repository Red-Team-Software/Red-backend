 export class Optional <T>{
    private value: T|undefined|null;
    private assigned:boolean;

    private constructor( value ?:T|null){
        this.value=value;
        if (value) this.assigned=true
        else this.assigned=false
    }

    hasValue():boolean{
        if ((this.value!==undefined)&&(this.value!==null)) {return this.assigned=true;}
        else return this.assigned=false;
    }

    get getValue():T{
        if (this.hasValue()) return <T>this.value
        else  throw new Error('Error el tipo de dato es undefiend')
    }

    static createEmpty<T>():Optional<T>{
        return new Optional()
    }

    static createWithValue<T>(value:T):Optional<T>{
        return new Optional(value)
    }
}

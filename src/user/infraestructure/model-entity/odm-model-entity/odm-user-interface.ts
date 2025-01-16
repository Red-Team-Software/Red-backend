import { UserRoles } from "src/user/domain/value-object/enum/user.roles"

export interface IOdmUser{
    id:string,
    name:string,
    phone:string,
    image:string
    type: UserRoles
    direction:{
        id: string,
        favorite:boolean,
        lat:number,
        lng: number
        name:string
    }[]
    wallet:{
        id:string,
        currency:string,
        amount:number
    }
}
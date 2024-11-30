import { UserRoles } from "src/user/domain/value-object/enum/user.roles"

export interface IUser{
    id:string,
    name:string,
    phone:string,
    image?:string
    type: UserRoles
}
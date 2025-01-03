import { UserRoles } from "src/user/domain/value-object/enum/user.roles";
import { IAccount } from "./account.interface";
import { ISession } from "./session.interface";

export interface ICredential{
    account:IAccount
    session:ISession
    userRole:UserRoles
}
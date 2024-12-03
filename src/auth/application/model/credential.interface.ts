import { IAccount } from "./account.interface";
import { ISession } from "./session.interface";

export interface ICredential{
    account:IAccount
    session:ISession
}
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { OrmAccountEntity } from "../../account/orm-entities/orm-account-entity"
import { DataSource, Repository } from "typeorm"
import { IAccount } from "src/auth/application/model/account.interface"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"



export class OdmAccountQueryRepository implements IQueryAccountRepository<IAccount>{

    constructor(dataSource:DataSource){}
    
    findAccountByEmail(email: string): Promise<Result<IAccount>> {
        throw new Error("Method not implemented.")
    }
    findAccountById(id: string): Promise<Result<IAccount>> {
        throw new Error("Method not implemented.")
    }
    findAccountByUserId(userId: string): Promise<Result<IAccount>> {
        throw new Error("Method not implemented.")
    }
    verifyAccountExistanceByEmail(email: string): Promise<Result<boolean>> {
        throw new Error("Method not implemented.")
    }
    findAllEmails(): Promise<Result<string[]>> {
        throw new Error("Method not implemented.")
    }

}
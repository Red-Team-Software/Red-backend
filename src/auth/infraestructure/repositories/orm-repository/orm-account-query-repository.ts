import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { OrmAccountEntity } from "../../orm/orm-entities/orm-account-entity"
import { DataSource, Repository } from "typeorm"
import { IAccount } from "src/auth/application/model/account.interface"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"



export class OrmAccountQueryRepository extends Repository<OrmAccountEntity> implements IQueryAccountRepository<IAccount>{

    constructor(dataSource:DataSource){
        super(OrmAccountEntity, dataSource.createEntityManager())
    }

    async findAccountByEmail(email: string): Promise<Result<IAccount>> {
        try{
            let account=await this.findOneBy({email})
            if (!account)
                return Result.fail( new NotFoundException('Find user by email unsucssessfully'))
            return Result.success({...account})
        }catch(e){
            return Result.fail( new NotFoundException('Find user by email unsucssessfully'))
        }
    }
    async findAccountById(id: string): Promise<Result<IAccount>> {
        try{
            let account=await this.findOneBy({id})
            if (!account)
                return Result.fail( new NotFoundException('Find user by id unsucssessfully'))
            return Result.success({...account})
        }catch(e){
            return Result.fail( new NotFoundException('Find user by id unsucssessfully'))
        }    
    }

    async verifyAccountExistanceByEmail(email: string): Promise<Result<boolean>> {
        try{
            let account=await this.findAccountByEmail(email)
            if(account.getValue)
                return Result.success(true)
            return Result.success(false)

        }catch(e){
            return Result.fail( new NotFoundException('Verify user by email unsucssessfully'))
        }
    }

    async findAllEmails(): Promise<Result<string[]>> {
        try{
            const accounts = await this.createQueryBuilder("account")
            .select("account.email")
            .getMany()
            const emails = accounts.map(account => account.email) 
            return Result.success(emails);
        }catch(e){
            return Result.fail( new NotFoundException('Error finding all emails'))
        }    
    }
}
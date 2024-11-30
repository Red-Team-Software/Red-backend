import { OrmAccountEntity } from "../../orm/orm-entities/orm-account-entity";
import { DataSource, Repository } from "typeorm";
import { IAccount } from "src/auth/application/model/account.interface";
import { Result } from "src/common/utils/result-handler/result";
import { ICommandAccountRepository } from "src/auth/application/repository/command-account-repository.interface";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";


export class OrmAccountCommandRepository extends Repository<OrmAccountEntity> implements ICommandAccountRepository<IAccount>{

    constructor(dataSource:DataSource){
        super(OrmAccountEntity, dataSource.createEntityManager())
    }

    async createAccount(entry: IAccount): Promise<Result<IAccount>> {
        try{
            let account =await this.save(entry)
            if (!account)
                return Result.fail( new PersistenceException('Create account unsucssessfully') )
            return Result.success(entry)
        }catch(e){
            return Result.fail( new PersistenceException('Create account unsucssessfully') )
        }
    }
    async updateAccount(entry: IAccount): Promise<Result<IAccount>> {
        try {
            const result = await this.save(entry)
            return Result.success(entry)
        } catch (e) {
            return Result.fail(new PersistenceException('Update account unsucssessfully'))
        }    
    }
    async deleteAccountById(id: string): Promise<Result<string>> {
        try {
            const result = this.delete({ id })   
            return Result.success(id)
        } catch (e) {
            return Result.fail(new PersistenceException('Delete account unsucssessfully'))
        }
    }
    async changeConfirmedVerification(email: string, verification: boolean): Promise<Result<IAccount>> {
        try {
            const resultFind = await this.findOneBy({email})
            this.update({email},{...resultFind,isConfirmed:verification})
        } 
        catch (e) {
                return Result.fail( new PersistenceException('Change confirmed verification account unsucssessfully') )
        }        
    }

}
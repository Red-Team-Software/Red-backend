import { OrmAccountEntity } from "../../orm/orm-entities/orm-account-entity";
import { DataSource, Repository } from "typeorm";
import { IAccount } from "src/auth/application/model/account.interface";
import { Result } from "src/common/utils/result-handler/result";
import { ICommandAccountRepository } from "src/auth/application/repository/command-account-repository.interface";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";


export class OrmAccountCommandRepository extends Repository<OrmAccountEntity> implements ICommandAccountRepository<IAccount>{

    private readonly ormUserRepository: Repository<OrmUserEntity>

    constructor(dataSource:DataSource){
        super(OrmAccountEntity, dataSource.createEntityManager())
        this.ormUserRepository=dataSource.getRepository( OrmUserEntity )
    }

    async addVerificationCode(id: string, code: string): Promise<Result<string>> {
        try {
            const result = await this.update({id},{code})
            
            if (!result)
                return Result.fail(new PersistenceException('Update account with code unsucssessfully'))
            
            return Result.success(id)
        } catch (e) {
            return Result.fail(new PersistenceException('Update account with code unsucssessfully'))
        } 
    }

    async createAccount(entry: IAccount): Promise<Result<IAccount>> {
        try{
            let ormAccount=OrmAccountEntity.create(
                entry.sessions,
                entry.id,
                entry.email,
                entry.password,
                entry.created_at,
                entry.isConfirmed,
                entry.idUser
            )
            ormAccount.user=await this.ormUserRepository.findOneBy({id:entry.idUser})

            if(!ormAccount.user)
                return Result.fail( new PersistenceException('Create account unsucssessfully, the user is not registered') )

            let account =await this.save(ormAccount)

            if (!account)
                return Result.fail( new PersistenceException('Create account unsucssessfully') )
            return Result.success(entry)
        }catch(e){
            return Result.fail( new PersistenceException('Create account unsucssessfully') )
        }
    }
    async updateAccount(entry: IAccount): Promise<Result<IAccount>> {
        try {
            let resultUpdate = await this.upsert(entry,['id'])         

            if (!resultUpdate)
                return Result.fail(new PersistenceException('Update account unsucssessfully'))
           
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
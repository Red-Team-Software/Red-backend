import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { IAccount } from "src/auth/application/model/account.interface"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"
import { OdmAccount, OdmAccountSchema } from "../../account/odm-entities/odm-account-entity"
import { Model, Mongoose } from "mongoose"



export class OdmAccountQueryRepository implements IQueryAccountRepository<IAccount>{

    private readonly model: Model<OdmAccount>;

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmAccount>('odmaccount', OdmAccountSchema)
    }

    async findAccountByEmail(email: string): Promise<Result<IAccount>> {
        try{
            let odm=await this.model.findOne({email})
            
            if(!odm)
                return Result.fail( new NotFoundException('Find account by email unsucssessfully'))
            
            return Result.success(odm)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find account by email unsucssessfully'))
        }    
    }
    async findAccountById(id: string): Promise<Result<IAccount>> {
        try{
            let odm=await this.model.findOne({id})
            
            if(!odm)
                return Result.fail( new NotFoundException('Find account by id unsucssessfully'))
            
            return Result.success(odm)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find account by id unsucssessfully'))
        }    
    }
    async findAccountByUserId(userId: string): Promise<Result<IAccount>> {
        try{
            let odm=await this.model.findOne({idUser:userId})
            
            if(!odm)
                return Result.fail( new NotFoundException('Find account by user id unsucssessfully'))
            
            return Result.success(odm)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find account by user id unsucssessfully'))
        }     
    }
    async verifyAccountExistanceByEmail(email: string): Promise<Result<boolean>> {
        try{
            let odm=await this.model.findOne({email}) 
            if(!odm)
                return Result.success(false)
            return Result.success(true)            
        }
        catch(e){
            return Result.fail( new NotFoundException('Verify account by email unsucssessfully'))
        }     
    }
    async findAllEmails(): Promise<Result<string[]>> {
        try{
            let odm=await this.model.find() 
            if(!odm)
            return Result.success(odm
                ? odm.map(o=>o.email)
                : []
            )
        }
        catch(e){
            return Result.fail( new NotFoundException('Find all emails unsucssessfully'))
        }   
    }

}
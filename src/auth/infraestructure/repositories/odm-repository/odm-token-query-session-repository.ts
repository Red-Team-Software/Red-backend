import { Model, Mongoose } from "mongoose";
import { ISession } from "src/auth/application/model/session.interface"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/query-token-session-repository.interface"
import { Result } from "src/common/utils/result-handler/result"
import { UserId } from "src/user/domain/value-object/user-id"
import { OdmAccount, OdmAccountSchema } from "../../account/odm-entities/odm-account-entity";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";


export class OrmTokenQueryRepository implements IQueryTokenSessionRepository<ISession>{

    private readonly model: Model<OdmAccount>;

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmAccount>('odmaccount', OdmAccountSchema)
    }
  
  findAllLastTokenSessions(): Promise<Result<string[]>> {
    throw new Error("Method not implemented.")
  }

  async findSessionById(id: string): Promise<Result<ISession>> {
  try{
    //TODO
      let odm=await this.model.find({"sessions.id":id}) 
    }
    catch(e){
      return Result.fail( new NotFoundException('Find session unsucssessfully'))
    }
  }
  findAllTokenSessions(): Promise<Result<string[]>> {
    throw new Error("Method not implemented.")
  }
  async findSessionLastSessionByUserId(id: UserId): Promise<Result<ISession>> {
        try{
            let odm=await this.model.find({idUser:id.Value}) 
        }
        catch(e){
            return Result.fail( new NotFoundException('Find all emails unsucssessfully'))
        }
  }
  
}
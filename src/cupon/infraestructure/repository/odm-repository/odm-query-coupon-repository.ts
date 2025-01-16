import { Model, Mongoose } from "mongoose";
import { Result } from "src/common/utils/result-handler/result";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";
import { IQueryCuponRepository } from "src/cupon/application/query-repository/query-cupon-repository";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { OdmCoupon, OdmCouponSchema } from "../../entities/odm-entities/odm-coupon-entity";
import { OdmCuponMapper } from "../../mapper/odm-mapper/orm-cupon-mapper";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";

export class OrmCuponQueryRepository implements IQueryCuponRepository {

    private readonly couponmodel: Model<OdmCoupon>;
    private readonly mapper: OdmCuponMapper

    constructor(mongoose: Mongoose) {
        this.couponmodel= mongoose.model<OdmCoupon>('odmcoupon', OdmCouponSchema)
        this.mapper= new OdmCuponMapper()
    }
    
    async findAllCupons(criteria: FindAllCuponsApplicationRequestDTO): Promise<Result<Cupon[]>> {
        try{
            let odm=await this.couponmodel.find()
            .skip(criteria.page)
            .limit(criteria.perPage)
            
            if(!odm)
                return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
            const cupons:Cupon[]=[]
            for (const c of odm){
                cupons.push(await this.mapper.fromPersistencetoDomain(c))
            }
            return Result.success(cupons)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
        }
    }
    async findCuponById(id: CuponId): Promise<Result<Cupon>> {
        try{
            let odm=await this.couponmodel.findOne({id:id.Value}) 
            if(!odm)
                return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
            return Result.success(await this.mapper.fromPersistencetoDomain(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
        }
    }
    async findCuponByCode(code: CuponCode): Promise<Result<Cupon>> {
        try{
            let odm=await this.couponmodel.findOne({code:code.Value}) 
            if(!odm)
                return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
            return Result.success(await this.mapper.fromPersistencetoDomain(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
        }
    }
    async verifyCuponExistenceByCode(code: CuponCode): Promise<Result<boolean>> {
        try{
            let odm=await this.couponmodel.findOne({code:code.Value}) 
            if(!odm)
                return Result.success(false)
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
        }
    }
    async verifyCuponExistenceByName(name: CuponName): Promise<Result<boolean>> {
        try{
            let odm=await this.couponmodel.findOne({name:name.Value}) 
            if(!odm)
                return Result.success(false)
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find coupon unsucssessfully'))
        }
    }

}

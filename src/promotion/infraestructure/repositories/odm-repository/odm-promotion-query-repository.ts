import { FindAllBundlesApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-application-request-dto";
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto";
import { IBundleModel } from "src/bundle/application/model/bundle.model.interface";
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { BundleName } from "src/bundle/domain/value-object/bundle-name";
import { Result } from "src/common/utils/result-handler/result";
import { OdmPromotionEntity, OdmPromotionSchema } from "../../entities/odm-entities/odm-promotion-entity";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OdmBundle, OdmBundleSchema } from "src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity";
import { OdmBundleMapper } from "src/bundle/infraestructure/mapper/odm-mapper/odm-bundle-mapper";
import { Model, Mongoose } from "mongoose";
import { IQueryPromotionRepository } from "src/promotion/application/query-repository/promotion.query.repository.interface";
import { FindAllPromotionApplicationRequestDTO } from "src/promotion/application/dto/request/find-all-promotion-application-request-dto";
import { IPromotion } from "src/promotion/application/model/promotion.interface";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
import { PromotionName } from "src/promotion/domain/value-object/promotion-name";


export class OdmPromotionQueryRepository implements IQueryPromotionRepository{

    private readonly model: Model<OdmPromotionEntity>;
    private readonly odmMapper: OdmBundleMapper

    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmPromotionEntity>('odmpromotion', OdmPromotionSchema)
        this.odmMapper= new OdmBundleMapper()
    }
    
    findAllPromotion(criteria: FindAllPromotionApplicationRequestDTO): Promise<Result<Promotion[]>> {
        throw new Error("Method not implemented.");
    }
    findPromotionById(id: PromotionId): Promise<Result<Promotion>> {
        throw new Error("Method not implemented.");
    }
    findPromotionWithMoreDetailsById(id: PromotionId): Promise<Result<IPromotion>> {
        throw new Error("Method not implemented.");
    }
    verifyPromotionExistenceByName(promotionName: PromotionName): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }
    findAllPromo(): Promise<Result<Promotion[]>> {
        throw new Error("Method not implemented.");
    }
}
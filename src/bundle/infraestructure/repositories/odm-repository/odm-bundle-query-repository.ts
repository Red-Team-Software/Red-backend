import { FindAllBundlesApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-application-request-dto";
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto";
import { IBundleModel } from "src/bundle/application/model/bundle.model.interface";
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { BundleName } from "src/bundle/domain/value-object/bundle-name";
import { Result } from "src/common/utils/result-handler/result";
import { OdmBundle, OdmBundleSchema } from "../../entities/odm-entities/odm-bundle-entity";
import { Model, Mongoose } from "mongoose";
import { OdmProductMapper } from "src/product/infraestructure/mapper/odm-mapper/odm-product-mapper";
import { OdmProduct } from "src/product/infraestructure/entities/odm-entities/odm-product-entity";
import { IProductModel } from "src/product/application/model/product.model.interface";


export class OdmBundleQueryRepository implements IQueryBundleRepository{

    private readonly model: Model<OdmBundle>;


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema)
    }

        private trasnformtoDataModel(odm:OdmProduct):IProductModel{
            return {
                id:odm.id,
                description:odm.description,
                caducityDate:
                odm.caducityDate
                ? odm.caducityDate
                : null,	
                name:odm.name,
                stock:odm.stock,
                images:odm.image,
                price:Number(odm.price),
                currency:odm.currency,
                weigth:odm.weigth,
                measurement:odm.measurament,
                categories: odm.category
                ? odm.category.map(c=>({
                    id:c.id,
                    name:c.name
                }))
                : [],
                promotion: []
                // odm.promotions
                // ? odm.promotions.map(promotion=>({
                //     id:promotion.id,
                //     name:promotion.name,
                //     discount:Number(promotion.discount)
                // }))
                // : []
            }
        }
    


    findAllBundles(criteria: FindAllBundlesApplicationRequestDTO): Promise<Result<IBundleModel[]>> {
        throw new Error("Method not implemented.");
    }
    findAllBundlesByName(criteria: FindAllBundlesbyNameApplicationRequestDTO): Promise<Result<Bundle[]>> {
        throw new Error("Method not implemented.");
    }
    findBundleById(id: BundleId): Promise<Result<Bundle>> {
        throw new Error("Method not implemented.");
    }
    findBundleWithMoreDetailById(id: BundleId): Promise<Result<IBundleModel>> {
        throw new Error("Method not implemented.");
    }
    findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>> {
        throw new Error("Method not implemented.");
    }
    verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }
}
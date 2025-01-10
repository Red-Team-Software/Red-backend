import { FindAllBundlesApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-application-request-dto"
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto"
import { IBundleModel } from "src/bundle/application/model/bundle.model.interface"
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"
import { Result } from "src/common/utils/result-handler/result"

export class BundleQueryRepositoryMock implements IQueryBundleRepository{

    constructor(private bundles: Bundle[] = []){}

    private transformtodatamodel(b:Bundle):IBundleModel{
        return{
            id:b.getId().Value,
            description:b.BundleDescription.Value,
            caducityDate:b.BundleCaducityDate
            ? b.BundleCaducityDate.Value
            : null,
            name:b.BundleName.Value,
            stock:b.BundleStock.Value,
            images:b.BundleImages.map(i=>i.Value),
            price:b.BundlePrice.Price,
            currency:b.BundlePrice.Currency,
            weigth:b.BundleWeigth.Weigth,
            measurement:b.BundleWeigth.Measure,
            categories:[],
            promotion:[],
            products:b.ProductId.map(i=>({
                id:i.Value,
                name:''
            }))        
        }
    }

    async findAllBundles(criteria: FindAllBundlesApplicationRequestDTO): Promise<Result<IBundleModel[]>> {
        let bundles= this.bundles.slice(criteria.page,criteria.perPage)
        return Result.success(
            bundles
            ? bundles.map(b=>this.transformtodatamodel(b))
            : []
        )    
    }
    async findAllBundlesByName(criteria: FindAllBundlesbyNameApplicationRequestDTO):
    Promise<Result<Bundle[]>> {
        let products= this.bundles.filter((b) => b.BundleName.Value.includes(criteria.name))
        products= products.slice(criteria.page,criteria.perPage)
        return Result.success(products)
    }
    async findBundleById(id: BundleId): Promise<Result<Bundle>> {
        let bundle=this.bundles.find((b) => b.getId().equals(id))
        if (!bundle)
            return Result.fail(new NotFoundException('Find bundle by id unsucssessfully'))
        return Result.success(bundle)
    }
    async findBundleWithMoreDetailById(id: BundleId): Promise<Result<IBundleModel>> {
        throw new Error("Method not implemented.")
    }
    async findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>> {
        let bundle=this.bundles.filter((b) => b.BundleName.equals(bundleName))
        if (!bundle)
            return Result.fail(new NotFoundException('Find bundle by name unsucssessfully'))
        return Result.success(bundle)
    }
    async verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> {
        let bundle=this.bundles.find((b) => b.BundleName.equals(bundleName))
        if (!bundle)
            return Result.success(false)
        return Result.success(true)
    }
}
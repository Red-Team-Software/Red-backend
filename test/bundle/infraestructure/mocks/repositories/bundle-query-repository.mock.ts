import { FindAllBundlesApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-application-request-dto"
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto"
import { IBundleModel } from "src/bundle/application/model/bundle.model.interface"
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { Result } from "src/common/utils/result-handler/result"

export class BundleQueryRepositoryMock implements IQueryBundleRepository{

    constructor(private bundles: Bundle[] = []){}

    async findAllBundles(criteria: FindAllBundlesApplicationRequestDTO): Promise<Result<Bundle[]>> {
        let bundles= this.bundles.slice(criteria.page,criteria.perPage)
        return Result.success(bundles)    
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
            return Result.fail(new PersistenceException('Find bundle by id unsucssessfully'))
        return Result.success(bundle)
    }
    async findBundleWithMoreDetailById(id: BundleId): Promise<Result<IBundleModel>> {
        throw new Error("Method not implemented.")
    }
    async findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>> {
        let bundle=this.bundles.filter((b) => b.BundleName.equals(bundleName))
        if (!bundle)
            return Result.fail(new PersistenceException('Find bundle by name unsucssessfully'))
        return Result.success(bundle)
    }
    async verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> {
        let bundle=this.bundles.find((b) => b.BundleName.equals(bundleName))
        if (!bundle)
            return Result.success(false)
        return Result.success(true)
    }
}
import { Result } from "src/common/utils/result-handler/result";
import { FindAllBundlesApplicationRequestDTO } from "../dto/request/find-all-bundles-application-request-dto";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { FindAllBundlesbyNameApplicationRequestDTO } from "../dto/request/find-all-bundles-by-name-application-request-dto";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { BundleName } from "src/bundle/domain/value-object/bundle-name";
import { IBundleModel } from "../model/bundle.model.interface";

export interface IQueryBundleRepository{
    findAllBundles(criteria:FindAllBundlesApplicationRequestDTO):Promise<Result<IBundleModel[]>> 
    findAllBundlesByName(criteria:FindAllBundlesbyNameApplicationRequestDTO):Promise<Result<Bundle[]>>
    findBundleById( id: BundleId ): Promise<Result<Bundle>>
    findBundleWithMoreDetailById( id: BundleId ): Promise<Result<IBundleModel>>
    findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>>
    verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> 
}
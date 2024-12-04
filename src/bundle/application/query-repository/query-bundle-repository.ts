import { Result } from "src/common/utils/result-handler/result";
import { FindAllBundlesApplicationRequestDTO } from "../dto/request/find-all-bundles-application-request-dto";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { FindAllBundlesbyNameApplicationRequestDTO } from "../dto/request/find-all-bundles-by-name-application-request-dto";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { BundleName } from "src/bundle/domain/value-object/bundle-name";

export interface IQueryBundleRepository{
    findAllBundles(criteria:FindAllBundlesApplicationRequestDTO):Promise<Result<Bundle[]>> 
    findAllBundlesByName(criteria:FindAllBundlesbyNameApplicationRequestDTO):Promise<Result<Bundle[]>>
    findBundleById( id: BundleId ): Promise<Result<Bundle>>
    findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>>
    verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> 
}
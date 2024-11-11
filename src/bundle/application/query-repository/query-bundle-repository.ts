import { Result } from "src/common/utils/result-handler/result";
import { FindAllBundlesApplicationRequestDTO } from "../dto/request/find-all-bundles-application-request-dto";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { FindAllBundlesbyNameApplicationRequestDTO } from "../dto/request/find-all-bundles-by-name-application-request-dto";

export interface IQueryBundleRepository{
    findAllBundles(criteria:FindAllBundlesApplicationRequestDTO):Promise<Result<Bundle[]>> 
    findAllBundlesByName(criteria:FindAllBundlesbyNameApplicationRequestDTO):Promise<Result<Bundle[]>> 
}
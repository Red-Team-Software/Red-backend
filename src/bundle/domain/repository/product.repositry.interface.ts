import { Result } from "src/common/utils/result-handler/result"
import { Bundle } from "../aggregate/bundle.aggregate"
import { BundleId } from "../value-object/bundle-id"
import { BundleName } from "../value-object/bundle-name"



export interface IBundleRepository {
    createBundle( bundle: Bundle ): Promise<Result<Bundle>>
    deleteBundleById( id: BundleId ): Promise<Result<BundleId>> 
    updateBundle( Bundle: Bundle ): Promise<Result<Bundle>>
    findBundleById( id: BundleId ): Promise<Result<Bundle>>
    findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>>
    verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> 
    // addCategoryToBundle(category:BundleCategory,id:BundleId):Promise<Result<Bundle>>
    // deleteCategoryIntoBundle(category:BundleCategory,BundleId:BundleId):Promise<Result<Bundle>>
}
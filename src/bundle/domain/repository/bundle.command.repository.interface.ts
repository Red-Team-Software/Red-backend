import { Result } from "src/common/utils/result-handler/result"
import { Bundle } from "../aggregate/bundle.aggregate"
import { BundleId } from "../value-object/bundle-id"



export interface ICommandBundleRepository {
    createBundle( bundle: Bundle ): Promise<Result<Bundle>>
    deleteBundleById( id: BundleId ): Promise<Result<BundleId>> 
    updateBundle( Bundle: Bundle ): Promise<Result<Bundle>>
    // addCategoryToBundle(category:BundleCategory,id:BundleId):Promise<Result<Bundle>>
    // deleteCategoryIntoBundle(category:BundleCategory,BundleId:BundleId):Promise<Result<Bundle>>
}
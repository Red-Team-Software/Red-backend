
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { ICommandBundleRepository } from "src/bundle/domain/repository/bundle.command.repository.interface";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { Result } from "src/common/utils/result-handler/result";


export class BundleCommadRepositoryMock implements ICommandBundleRepository{

    constructor(private bundles: Bundle[] = []){}

    async createBundle(bundle: Bundle): Promise<Result<Bundle>> {
        this.bundles.push(bundle)
        return Result.success(bundle)   
    }
    async deleteBundleById(id: BundleId): Promise<Result<BundleId>> {
        this.bundles = this.bundles.filter((b) => b.getId().equals(id))
        return Result.success(id)
    }
    async updateBundle(bundle: Bundle): Promise<Result<Bundle>> {
        this.bundles = this.bundles.filter((b) => b.getId().equals(bundle.getId()))
        this.bundles.push(bundle)
        return Result.success(bundle)    
    }
}
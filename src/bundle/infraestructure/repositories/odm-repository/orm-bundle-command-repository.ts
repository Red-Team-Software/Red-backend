import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { Result } from "src/common/utils/result-handler/result"
import { ICommandBundleRepository } from "src/bundle/domain/repository/bundle.command.repository.interface"
import { Model, Mongoose } from "mongoose"
import { OdmBundle, OdmBundleSchema } from "../../entities/odm-entities/odm-bundle-entity"

export class OdmBundleCommandRepository implements ICommandBundleRepository{

    private readonly model: Model<OdmBundle>;


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema)
    }
    

    createBundle(bundle: Bundle): Promise<Result<Bundle>> {
        throw new Error("Method not implemented.")
    }
    deleteBundleById(id: BundleId): Promise<Result<BundleId>> {
        throw new Error("Method not implemented.")
    }
    updateBundle(Bundle: Bundle): Promise<Result<Bundle>> {
        throw new Error("Method not implemented.")
    }
}
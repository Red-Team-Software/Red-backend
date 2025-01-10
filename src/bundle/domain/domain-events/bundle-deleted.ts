import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { BundleId } from "../value-object/bundle-id"

export class BundleDeleted extends DomainEvent {
    serialize(): string {
        let data= {  
            bundleId:this.bundleId.Value
        }
        
        return JSON.stringify(data)
    }
    static create(
        bundleId:BundleId
    ){
        return new BundleDeleted(
            bundleId
        )
    }
    constructor(
        public bundleId:BundleId
    ){
        super()
    }
}
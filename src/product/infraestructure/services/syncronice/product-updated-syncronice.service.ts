import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { ProductUpdatedInfraestructureRequestDTO } from '../dto/request/product-updated-infraestructure-request-dto';
import { OdmProduct, OdmProductSchema } from '../../entities/odm-entities/odm-product-entity';
import { Mongoose, Model } from 'mongoose';
import { OdmBundle, OdmBundleSchema } from 'src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity';

export class ProductUpdatedSyncroniceService 
implements ISycnchronizeService<ProductUpdatedInfraestructureRequestDTO,void>{
    
    private readonly productModel: Model<OdmProduct>
    private readonly bundleModel: Model<OdmBundle>


    constructor( mongoose: Mongoose ) { 
        this.productModel = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema)
        this.bundleModel = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema)
    }
    async execute(event: ProductUpdatedInfraestructureRequestDTO): Promise<Result<void>> {
        let product= await this.productModel.findOne({id:event.productId})
        if (event.productCaducityDate)
            await this.productModel.updateOne({ id: product.id }, {$set: {caducityDate: event.productCaducityDate}});
        
        if (event.productDescription)
            await this.productModel.updateOne({ id: product.id }, {$set: {description: event.productDescription}});

        if (event.productImages){
            await this.productModel.updateOne({ id: product.id }, {$set: {image: event.productImages}});
        }
        if (event.productName){
            await this.productModel.updateOne({ id: product.id }, {$set: {name: event.productName}});
            /*await this.bundleModel.updateMany(
                { 'products.productId': product.id },
                { $set: { 'products.name': product } }
            );*/
        }
        if (event.productPrice){
            await this.productModel.updateOne({ id: product.id }, {$set: {price: event.productPrice.price}});
            await this.productModel.updateOne({ id: product.id }, {$set: {currency: event.productPrice.currency}});
            //product.price=event.productPrice.price
            //product.currency=event.productPrice.currency
        }
        if (event.productStock){
            console.log("stock",event.productStock)
            //product.stock=event.productStock
            await this.productModel.updateOne({ id: product.id }, {$set: {stock: event.productStock}});
        }
        if (event.productWeigth){
            //product.weigth=event.productWeigth.weigth
            //product.measurament=event.productWeigth.measure

            await this.productModel.updateOne({ id: product.id }, {$set: {weigth: event.productWeigth.weigth}});
            await this.productModel.updateOne({ id: product.id }, {$set: {measurament: event.productWeigth.measure}});
        }

        //await this.productModel.updateOne({id:product.id},product)

        
        await this.bundleModel.updateMany(
            { 'products.productId': product.id },
            { $set: { 'products.$': product } }
        );

        
        return Result.success(undefined)
    }   
}
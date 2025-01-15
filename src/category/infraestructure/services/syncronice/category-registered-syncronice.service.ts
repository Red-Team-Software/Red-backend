import { Result } from 'src/common/utils/result-handler/result';
import { ISycnchronizeService } from 'src/common/infraestructure/synchronize-service/synchronize.service.interface';
import { Model, Mongoose } from 'mongoose';
import { OdmBundle, OdmBundleSchema } from 'src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity';
import { OdmProduct, OdmProductSchema } from 'src/product/infraestructure/entities/odm-entities/odm-product-entity';
import { OdmCategory, OdmProductCategorySchema } from '../../entities/odm-entities/odm-category.entity';
import { CategoryRegistredInfraestructureRequestDTO } from '../dto/request/category-registered-infraestructure-request-dto';

export class CategoryRegisteredSyncroniceService 
implements ISycnchronizeService<CategoryRegistredInfraestructureRequestDTO,void>{

    private readonly bundlemodel: Model<OdmBundle>
    private readonly productmodel: Model<OdmProduct>
    private readonly categorymodel: Model<OdmCategory>

    constructor( mongoose: Mongoose ) { 
        this.bundlemodel = mongoose.model<OdmBundle>('odmbundle', OdmBundleSchema)
        this.productmodel = mongoose.model<OdmProduct>('odmproduct', OdmProductSchema)
        this.categorymodel= mongoose.model<OdmCategory>('odmcategory', OdmProductCategorySchema)
    }
    
    async execute(event: CategoryRegistredInfraestructureRequestDTO): Promise<Result<void>> {

        const odmProducts: OdmProduct[]=[];
        const odmBundles:OdmBundle[]=[]

        for (const productId of event.products) {
          let odmProduct = await this.productmodel.findOne({ id: productId });
          if (odmProduct) {
            odmProducts.push(odmProduct);
            odmProduct.category.push({id:event.categoryId,name:event.categoryName})
            odmProduct.save()
          }
        }

        for (const bundleId of event.bundles) {
            let odmBundle = await this.bundlemodel.findOne({ id: bundleId });
            if (odmBundle) {
              odmBundles.push(odmBundle);
              odmBundle.category.push({id:event.categoryId,name:event.categoryName})
              odmBundle.save()
            }
        }

        const category = new this.categorymodel({
            id: event.categoryId,
            name: event.categoryName,
            image: event.categoryImage,
            products:odmProducts
            ? odmProducts.map(p=>({
              id:p.id,
              name:p.name
            }))
            : [],
            bundles:odmProducts
            ? odmBundles.map(p=>({
              id:p.id,
              name:p.name
            }))
            : [],
        })
        await this.categorymodel.create(category)
        return Result.success(undefined)
    }   
}
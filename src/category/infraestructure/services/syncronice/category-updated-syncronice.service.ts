import { Model, Mongoose } from "mongoose";
import { ISycnchronizeService } from "src/common/infraestructure/synchronize-service/synchronize.service.interface";
import { Result } from "src/common/utils/result-handler/result";
import { OdmProduct, OdmProductSchema } from "src/product/infraestructure/entities/odm-entities/odm-product-entity";
import { CategoryUpdatedInfraestructureRequestDTO } from "../dto/request/category-updated-infraestructure-request-dto";
import { OdmCategory, OdmProductCategorySchema } from "../../entities/odm-entities/odm-category.entity";
import { OdmBundle, OdmBundleSchema } from "src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity";
import { Category } from "src/category/domain/aggregate/category.aggregate";

export class CategoryUpdatedSyncroniceService 
implements ISycnchronizeService<CategoryUpdatedInfraestructureRequestDTO, void> {

    private readonly productmodel: Model<OdmProduct>;
    private readonly bundlemodel: Model<OdmBundle>;
    private readonly categorymodel: Model<OdmCategory>;

    constructor(mongoose: Mongoose) {
        this.bundlemodel = mongoose.model<OdmBundle>('odmbundle', OdmBundleSchema);
        this.productmodel = mongoose.model<OdmProduct>('odmproduct', OdmProductSchema);
        this.categorymodel = mongoose.model<OdmCategory>('odmcategory', OdmProductCategorySchema);
    }

    async execute(event: CategoryUpdatedInfraestructureRequestDTO): Promise<Result<void>> {

        // Buscar la categoría por su ID
        let category = await this.categorymodel.findOne({ id: event.categoryId });

        // Verificar si la categoría existe
        if (!category) {
            console.error(`La categoría con id ${event.categoryId} no existe.`);
        }

        // Actualizar los campos de la categoría si están presentes en el evento
        if (event.categoryName) 
            await this.categorymodel.updateOne({ id: category.id }, {$set: {name: event.categoryName}});

        if (event.categoryImage) 
            await this.categorymodel.updateOne({ id: category.id }, {$set: {image: event.categoryImage}});

        // Actualizar productos asociados a la categoría
        if (event.products) {
            const odmProducts: OdmProduct[] = [];
            for (const productId of event.products) {
                let odmProduct = await this.productmodel.findOne({ id: productId });
                if (odmProduct) {
                    // Actualizar categorías en cada producto
                    odmProduct.category = odmProduct.category.filter(cat => cat.id !== category.id);
                    odmProduct.category.push({ id: category.id, name: category.name });
                    await odmProduct.save();
                    odmProducts.push(odmProduct);
                }
            }
            await this.categorymodel.updateOne({ id: category.id }, {$set: {products: odmProducts}});
        }
        // Actualizar bundles asociados a la categoría
        
        if (event.bundles) {
            const odmBundles: OdmBundle[] = [];
            for (const bundleid of event.bundles) {
                let odmBundle = await this.bundlemodel.findOne({ id: bundleid });
                if (odmBundle) {
                    // Actualizar categorías en cada bundle
                    odmBundle.category = odmBundle.category.filter(cat => cat.id !== category.id);
                    odmBundle.category.push({ id: category.id, name: category.name });
                    await odmBundle.save();
                    odmBundles.push(odmBundle);
                }
            }
            await this.categorymodel.updateOne({ id: category.id }, {$set: {bundles: odmBundles}});
        }

        return Result.success(undefined);
    }   
}

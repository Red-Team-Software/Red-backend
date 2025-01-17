import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/utils/result-handler/result';
import { Category } from 'src/category/domain/aggregate/category.aggregate';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { IQueryCategoryRepository } from 'src/category/application/query-repository/query-category-repository';
import { NotFoundException } from 'src/common/infraestructure/infraestructure-exception';
import { FindAllCategoriesApplicationRequestDTO } from 'src/category/application/dto/request/find-all-categories-request.dto';
import { FindCategoryByIdApplicationRequestDTO } from 'src/category/application/dto/request/find-category-by-id-application-request.dto';
import { FindCategoryByProductIdApplicationRequestDTO } from 'src/category/application/dto/request/find-category-by-productid-application-request.dto';
import { CategoryName } from 'src/category/domain/value-object/category-name';
import { ICategory } from 'src/category/application/model/category.model';
import { FindCategoryByBundleIdApplicationRequestDTO } from 'src/category/application/dto/request/find-category-by-bundle-id-application-request.dto';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { OdmCategory, OdmProductCategorySchema } from '../../entities/odm-entities/odm-category.entity';
import { OdmProduct, OdmProductSchema } from 'src/product/infraestructure/entities/odm-entities/odm-product-entity';
import { OdmBundle, OdmBundleSchema } from 'src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity';
import { Model, Mongoose } from 'mongoose';
import { OdmPromotionEntity } from 'src/promotion/infraestructure/entities/odm-entities/odm-promotion-entity';
import { OdmCategoryMapper } from '../../mapper/odm-mapper/odm-category-mapper';

export class OdmCategoryQueryRepository implements IQueryCategoryRepository {

    private readonly productmodel: Model<OdmProduct>;
    private readonly promotionmodel:Model<OdmPromotionEntity>
    private readonly bundlemodel: Model<OdmBundle>;
    private readonly categorymodel: Model<OdmCategory>
    private readonly mapper:OdmCategoryMapper

    constructor(mongoose: Mongoose) {
        this.bundlemodel = mongoose.model<OdmBundle>('odmbundle', OdmBundleSchema)
        this.productmodel = mongoose.model<OdmProduct>('odmproduct', OdmProductSchema)
        this.categorymodel= mongoose.model<OdmCategory>('odmcategory', OdmProductCategorySchema)
        this.mapper= new OdmCategoryMapper()
    }


    async trasnformtodatamodel(odm:OdmCategory):Promise<ICategory>{


        const products = await this.productmodel.find({
            id: { $in: odm.products.map(p=>p.id) }
        }).exec();

        const bundles = await this.bundlemodel.find({
            id: { $in: odm.bundles.map(p=>p.id) }
        }).exec();

        return {
            id:odm.id,
            name: odm.name,
            image: odm.image,
            products: products
            ? products.map(p=>({
                id:p.id,
                name:p.name,
                images:p.image,
                description:p.description,
                price:p.price
            }))
            : [],
            bundles: bundles
            ? bundles.map(b=>({
                id:b.id,
                name:b.name,
                images:b.image,
                description:b.description,
                price:b.price
            }))
            : []
        }
    }



    async findAllCategories(criteria: FindAllCategoriesApplicationRequestDTO): Promise<Result<Category[]>> {
        try {
            const model:Category[]=[]

            const odm = await this.categorymodel.find()
            .skip(criteria.page)
            .limit(criteria.perPage)
            .exec()

            for (const o of odm){
                model.push(await this.mapper.fromPersistencetoDomain(o))
            }

            return Result.success(model)
        
        } catch (error) {
            return Result.fail(error.message);
        }
    }
    async findCategoryById(id: CategoryID): Promise<Result<Category>> {
        try{
            let odm=await this.categorymodel.findOne({id:id.Value}) 
            if(!odm)
                return Result.fail( new NotFoundException('Find category unsucssessfully'))
            return Result.success(await this.mapper.fromPersistencetoDomain(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find category unsucssessfully'))
        }
    }

    async findCategoryByName(categoryName: CategoryName): Promise<Result<boolean>> {
        try{
            let odm=await this.categorymodel.findOne({name:categoryName.Value}) 
            if(!odm)
                return Result.fail( new NotFoundException('Find category unsucssessfully'))
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find category unsucssessfully'))
        }
    }
    async findCategoryByIdMoreDetail(criteria: FindCategoryByIdApplicationRequestDTO): Promise<Result<ICategory>> {
        try{
            let odm=await this.categorymodel.findOne({id:criteria.id}) 
            if(!odm)
                return Result.fail( new NotFoundException('Find category unsucssessfully'))
            return Result.success(await this.trasnformtodatamodel(odm))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find category unsucssessfully'))
        }
    }
    async findCategoryByProductId(criteria: FindCategoryByProductIdApplicationRequestDTO): Promise<Result<Category[]>> {
        try{
            const odm = await this.categorymodel.find({
                products: { $elemMatch: { id: criteria.id } }
            }).exec()
            if(!odm)
                return Result.fail( new NotFoundException('Find category unsucssessfully'))
            const categories:Category[]=[]

            for (const c of odm){
                categories.push(await this.mapper.fromPersistencetoDomain(c))
            }

            return Result.success(categories)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find category unsucssessfully'))
        }
    }
    async findCategoryByBundleId(criteria: FindCategoryByBundleIdApplicationRequestDTO): Promise<Result<Category[]>> {
        try{
            const odm = await this.categorymodel.find({
                bundles: { $elemMatch: { id: criteria.id } }
            }).exec()
            if(!odm)
                return Result.fail( new NotFoundException('Find category unsucssessfully'))
            const categories:Category[]=[]

            for (const c of odm){
                categories.push(await this.mapper.fromPersistencetoDomain(c))
            }

            return Result.success(categories)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find category unsucssessfully'))
        }    
    }
    async verifyCategoryExistenceByName(categoryName: CategoryName): Promise<Result<boolean>> {
        try{
            let odm=await this.categorymodel.findOne({name:categoryName.Value}) 
            if(!odm)
                return Result.success(false)
            return Result.success(true)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find category unsucssessfully'))
        }
    }

}

import { DataSource, Repository } from "typeorm";
import { OrmProductEntity } from "../../entities/orm-entities/orm-product-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductName } from "src/product/domain/value-object/product-name";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmProductMapper } from "../../mapper/orm-mapper/orm-product-mapper";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { OrmProductImage } from "../../entities/orm-entities/orm-product-image";
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface";


export class OrmProductRepository extends Repository<OrmProductEntity> implements ICommandProductRepository{

    private mapper:IMapper <Product,OrmProductEntity>
    private readonly ormProductImageRepository: Repository<OrmProductImage>


    constructor(dataSource:DataSource){
        super( OrmProductEntity, dataSource.createEntityManager() )
        this.mapper=new OrmProductMapper(new UuidGen())
        this.ormProductImageRepository=dataSource.getRepository( OrmProductImage )
    }

    async createProduct(product: Product): Promise<Result<Product>> {
        try{
            const entry=await this.mapper.fromDomaintoPersistence(product)
            const response= await this.save(entry)
            for (const image of entry.images ){
                this.ormProductImageRepository.save(image)
            }
            return Result.success(product)
        }catch(e){
            return Result.fail( new PersistenceException('Create product unsucssessfully') )
        }
    }
    async deleteProductById(id: ProductID): Promise<Result<ProductID>> {
        try {
            const result = await this.delete({ id: id.Value })
            
            if(result.affected!==1)
                return Result.fail(new PersistenceException('Delete product unsucssessfully'))
            
            await this.ormProductImageRepository.delete({product_id:id.Value})
            
            return Result.success(id) 
        } catch (e) {
            return Result.fail(new PersistenceException('Delete product unsucssessfully'))
        }
    }
    async updateProduct(product: Product): Promise<Result<Product>> {
        const persis = await this.mapper.fromDomaintoPersistence(product)
        try {
            const result = await this.upsert(persis,['id'])
            await this.ormProductImageRepository.delete({product_id:product.getId().Value})

            for (const image of persis.images) {
                await this.ormProductImageRepository.save(image);
              }
            return Result.success(product)
        } catch (e) {
            return Result.fail(new PersistenceException('Update product unsucssessfully'))
        }
    }
}
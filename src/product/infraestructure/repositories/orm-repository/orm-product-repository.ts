import { DataSource, Repository } from "typeorm";
import { OrmProductEntity } from "../../entities/orm-entities/orm-product-entity";
import { IProductRepository } from "src/product/domain/repository/product.interface.repositry";
import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductName } from "src/product/domain/value-object/product-name";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmProductMapper } from "../../mapper/orm-mapper/orm-product-mapper";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { OrmProductImage } from "../../entities/orm-entities/orm-product-image";


export class OrmProductRepository extends Repository<OrmProductEntity> implements IProductRepository{

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
            return Result.fail( new Error('Create product unsucssessfully') )
        }
    }
    async deleteProductById(id: ProductID): Promise<Result<ProductID>> {
        try {
            const result = this.delete({ id: id.Value })   
            return Result.success(id) 
        } catch (e) {
            return Result.fail(new Error('Delete product unsucssessfully'))
        }
    }
    async updateProduct(product: Product): Promise<Result<Product>> {
        const persis = await this.mapper.fromDomaintoPersistence(product)
        try {
            const result = await this.save(persis)
            return Result.success(product)
        } catch (e) {
            return Result.fail(new Error('Update product unsucssessfully'))
        }
    }
    async findProductById(id: ProductID): Promise<Result<Product>> {
        try{
            const ormActivity=await this.findOneBy({id:id.Value})
            
            if(!ormActivity)
                return Result.fail( new Error('Find product unsucssessfully'))

            const activity=await this.mapper.fromPersistencetoDomain(ormActivity)
            
            return Result.success(activity)
        }catch(e){
            return Result.fail( new Error('Find product unsucssessfully'))
        }    
    }
    async findProductByName(ProductName: ProductName): Promise<Result<Product[]>> {
        throw new Error("Method not implemented.");
    }

    async verifyProductExistenceByName(ProductName: ProductName): Promise<Result<boolean>> {
        try{
            const account = await this.findOneBy({name:ProductName.Value})
            if(account) return Result.success(true)
                return Result.success(false)
        }
        catch(e){
            return Result.fail( new Error('Find product by name unsucssessfully'))
        }    
    }
}
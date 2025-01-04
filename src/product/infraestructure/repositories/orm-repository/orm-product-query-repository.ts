import { DataSource, MoreThan, Repository } from "typeorm";
import { OrmProductEntity } from "../../entities/orm-entities/orm-product-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmProductMapper } from "../../mapper/orm-mapper/orm-product-mapper";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository";
import { FindAllProductsApplicationRequestDTO } from "src/product/application/dto/request/find-all-products-application-request-dto";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { FindAllProductsbyNameApplicationRequestDTO } from "src/product/application/dto/request/find-all-products-and-combos-application-request-dto";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductName } from "src/product/domain/value-object/product-name";
import { IProductModel } from "src/product/application/model/product.model.interface";


export class OrmProductQueryRepository extends Repository<OrmProductEntity> implements IQueryProductRepository{

    private mapper:IMapper <Product,OrmProductEntity>

    constructor(dataSource:DataSource){
        super( OrmProductEntity, dataSource.createEntityManager() )
        this.mapper=new OrmProductMapper(new UuidGen())
    }

    async findProductWithMoreDetailById(id: ProductID): Promise<Result<IProductModel>> {
        try{

            const ormProduct = await this.createQueryBuilder('product')
                .where('product.id = :id', { id: `${id.Value}` }) 
                .leftJoinAndSelect('product.images', 'product_image')
                .leftJoinAndSelect('product.promotions','promotion')
                .leftJoinAndSelect('product.categories','category')
                .getOne();

            if(!ormProduct)
                return Result.fail( new NotFoundException('Find product unsucssessfully'))

            return Result.success(
                {
                    id:ormProduct.id,
                    description:ormProduct.desciption,
                    caducityDate:
                    ormProduct.caducityDate
                    ? ormProduct.caducityDate
                    : null,	
                    name:ormProduct.name,
                    stock:ormProduct.stock,
                    images:ormProduct.images.map(image=>image.image),
                    price:Number(ormProduct.price),
                    currency:ormProduct.currency,
                    weigth:ormProduct.weigth,
                    measurement:ormProduct.measurament,
                    categories: [],
                    promotion:
                    ormProduct.promotions
                    ? ormProduct.promotions.map(promotion=>({
                        id:promotion.id,
                        name:promotion.name,
                        discount:Number(promotion.discount)
                    }))
                    : []
                }
            )

        }catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }  
    }

    async findAllProductsByName(criteria: FindAllProductsbyNameApplicationRequestDTO): Promise<Result<Product[]>> {
        try{
            const ormProducts = await this.createQueryBuilder('product')
                .where('LOWER(product.name) LIKE :name', { name: `%${criteria.name.toLowerCase().trim()}%` })
                .andWhere('product.stock > :stock', { stock: 0 })
                .leftJoinAndSelect('product.images', 'product_image')
                .orderBy('product.caducityDate', 'DESC')
                .take(criteria.perPage)
                .skip(criteria.page)
                .getMany();

            // if(ormProducts.length==0)
            //     return Result.fail( new NotFoundException('products empty please try again'))

            const products:Product[]=[]

            for (const product of ormProducts){
                products.push(await this.mapper.fromPersistencetoDomain(product))
            }
            return Result.success(products)
        }catch(e){
            return Result.fail( new NotFoundException('products empty please try again'))
        }
    }

    async findAllProducts(criteria:FindAllProductsApplicationRequestDTO ): Promise<Result<Product[]>>
    {
        try{
            const ormProducts=await this.find({
                take:criteria.perPage,
                skip:criteria.page,
                where:{
                    stock:MoreThan(0)
                }
            })

            // if(ormProducts.length===0)
            //     return Result.fail( new NotFoundException('products empty please try again'))

            const products:Product[]=[]
            for (const product of ormProducts){
                products.push(await this.mapper.fromPersistencetoDomain(product))
            }
            return Result.success(products)
        }catch(e){
            return Result.fail( new NotFoundException('products empty please try again'))
        }
    }
    async findProductById(id: ProductID): Promise<Result<Product>> {
        try{
            const ormProduct=await this.findOneBy({id:id.Value})
            
            if(!ormProduct)
                return Result.fail( new NotFoundException('Find product unsucssessfully'))

            const activity=await this.mapper.fromPersistencetoDomain(ormProduct)
            
            return Result.success(activity)
        }catch(e){
            return Result.fail( new NotFoundException('Find product unsucssessfully'))
        }    
    }
    async findProductByName(productName: ProductName): Promise<Result<Product[]>> {
        try{
            const product = await this.findBy({name:productName.Value})
            let domain=product.map(async infraestrcuture=>await this.mapper.fromPersistencetoDomain(infraestrcuture))
            return Result.success(await Promise.all(domain))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product by name unsucssessfully'))
        }         
    }

    async verifyProductExistenceByName(productName: ProductName): Promise<Result<boolean>> {
        try{
            let response=await this.existsBy({name:productName.Value})
            return Result.success(response)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product by name unsucssessfully'))
        }    
    }

}
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
import { FindAllProductsbyNameApplicationRequestDTO } from "src/product/application/dto/request/find-all-products-and-combos-request-dto";
import { ProductID } from "src/product/domain/value-object/product-id";


export class OrmProductQueryRepository extends Repository<OrmProductEntity> implements IQueryProductRepository{

    private mapper:IMapper <Product,OrmProductEntity>

    constructor(dataSource:DataSource){
        super( OrmProductEntity, dataSource.createEntityManager() )
        this.mapper=new OrmProductMapper(new UuidGen())
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

            if(ormProducts.length===0)
                return Result.fail( new NotFoundException('products empty please try again'))

            const products:Product[]=[]
            for (const product of ormProducts){
                products.push(await this.mapper.fromPersistencetoDomain(product))
            }
            return Result.success(products)
        }catch(e){
            return Result.fail( new NotFoundException('products empty please try again'))
        }
    }
    
}
import { DataSource, MoreThan, Repository } from "typeorm";
import { OrmProductEntity } from "../../entities/orm-entities/orm-product-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmProductMapper } from "../../mapper/orm-mapper/orm-product-mapper";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { OrmProductImage } from "../../entities/orm-entities/orm-product-image";
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository";
import { FindAllProductsApplicationRequestDTO } from "src/product/application/dto/request/find-all-products-application-request-dto";
import { log } from "console";


export class OrmProductQueryRepository extends Repository<OrmProductEntity> implements IQueryProductRepository{

    private mapper:IMapper <Product,OrmProductEntity>
    private readonly ormProductImageRepository: Repository<OrmProductImage>


    constructor(dataSource:DataSource){
        super( OrmProductEntity, dataSource.createEntityManager() )
        this.mapper=new OrmProductMapper(new UuidGen())
        this.ormProductImageRepository=dataSource.getRepository( OrmProductImage )
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
                return Result.fail( new Error('Find products unsucssessfully'))

            const products:Product[]=[]
            for (const product of ormProducts){
                products.push(await this.mapper.fromPersistencetoDomain(product))
            }
            return Result.success(products)
        }catch(e){
            return Result.fail( new Error('Find products unsucssessfully'))
        }
    }
     
}
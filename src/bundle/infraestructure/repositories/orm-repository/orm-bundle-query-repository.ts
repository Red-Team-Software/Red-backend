import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { OrmBundleEntity } from "../../entities/orm-entities/orm-bundle-entity"
import { DataSource, MoreThan, Repository, ManyToMany } from 'typeorm';
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { Result } from "src/common/utils/result-handler/result"
import { OrmBundleMapper } from "../../mapper/orm-mapper/orm-bundle-mapper"
import { FindAllBundlesApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-application-request-dto"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { IBundleModel } from "src/bundle/application/model/bundle.model.interface"


export class OrmBundleQueryRepository extends Repository<OrmBundleEntity> implements IQueryBundleRepository{


    private mapper:IMapper <Bundle,OrmBundleEntity>


    constructor(dataSource:DataSource){
        super( OrmBundleEntity, dataSource.createEntityManager() )
        this.mapper=new OrmBundleMapper(dataSource,new UuidGen())
    }
    async findAllBundles(criteria: FindAllBundlesApplicationRequestDTO): Promise<Result<Bundle[]>> {
        {
            try{
                const ormBundle=await this.find({
                    take:criteria.perPage,
                    skip:criteria.page,
                    where:{
                        stock:MoreThan(0)
                    }
                })
    
                // if(ormBundle.length==0)
                //     return Result.fail( new NotFoundException('bundles empty please try again'))
    
                const bundles:Bundle[]=[]
                for (const bundle of ormBundle){
                    bundles.push(await this.mapper.fromPersistencetoDomain(bundle))
                }
                return Result.success(bundles)
            }catch(e){
                return Result.fail( new NotFoundException('bundles empty please try again'))
            }
        }    
    }
    async findAllBundlesByName(criteria: FindAllBundlesbyNameApplicationRequestDTO): Promise<Result<Bundle[]>> {
        {
            try{

                let ormBundle = await this.createQueryBuilder('bundle')
                .innerJoinAndSelect('bundle.products', 'bundle_product')
                .leftJoinAndSelect('bundle.images', 'bundle_image')
                .where('LOWER(bundle.name) LIKE :name', { name: `%${criteria.name.toLowerCase().trim()}%` })
                .andWhere('bundle.stock > :stock', { stock: 0 })
                .orderBy('bundle.caducityDate', 'DESC')
                .skip(criteria.page)
                .take(criteria.perPage)
                .getMany();
            

                // if(ormBundle.length==0)
                //     return Result.fail( new NotFoundException('bundles not foudnd please try again'))

                const bundles:Bundle[]=[]
                for (const bundle of ormBundle){
                    bundles.push(await this.mapper.fromPersistencetoDomain(bundle))
                }
                return Result.success(bundles)
            }catch(e){
                return Result.fail( new NotFoundException('bundles not foudnd please try again'))
            }
        }     
    }
    async findBundleById(id: BundleId): Promise<Result<Bundle>> {
        try{
            const ormActivity=await this.findOneBy({id:id.Value})
            
            if(!ormActivity)
                return Result.fail( new NotFoundException('Find bundle unsucssessfully'))

            const activity=await this.mapper.fromPersistencetoDomain(ormActivity)
            
            return Result.success(activity)
        }catch(e){
            return Result.fail( new NotFoundException('Find bundle unsucssessfully'))
        }    
    }

    async findBundleWithMoreDetailById(id: BundleId): Promise<Result<IBundleModel>> {
        try{

            const ormBundle = await this.createQueryBuilder('bundle')
            .where('bundle.id = :id', { id: `${id.Value}` }) 
            .leftJoinAndSelect('bundle.images', 'bundle_image')
            .leftJoinAndSelect('bundle.promotions','promotion')
            .leftJoinAndSelect('bundle.products','products')
            .getOne();
            
            if(!ormBundle)
                return Result.fail( new NotFoundException('Find promotion unsucssessfully'))

            return Result.success({
                id:ormBundle.id,
                description:ormBundle.desciption,
                caducityDate:ormBundle.caducityDate,
                name:ormBundle.name,
                stock:ormBundle.stock,
                image:ormBundle.images.map(image=>image.image),
                price:ormBundle.price,
                currency:ormBundle.currency,
                weigth:ormBundle.weigth,
                measurement:ormBundle.measurament,
                categories:[],
                promotion:ormBundle.promotions
                ? ormBundle.promotions.map(promotion=>({
                    id:promotion.id,
                    name:promotion.name,
                    discount:promotion.discount
                }))
                : [],
                products:ormBundle.products
                ? ormBundle.products.map(product=>({
                    id:product.id,
                    name:product.name
                }))
                : []
            })
        }catch(e){
            console.log(e)
            return Result.fail( new NotFoundException('Find promotion unsucssessfully'))
        }  

    }

    async findBundleByName(bundleName: BundleName): Promise<Result<Bundle[]>> {
        try{
            const bundle = await this.findBy({name:bundleName.Value})
            if(bundle.length==0) 
                return Result.fail( new NotFoundException('Find product by name unsucssessfully they are 0 registered'))
            let domain=bundle.map(async infraestrcuture=>await this.mapper.fromPersistencetoDomain(infraestrcuture))
            return Result.success(await Promise.all(domain))
        }
        catch(e){
            return Result.fail( new NotFoundException('Find product by name unsucssessfully'))
        }                 
    }
    async verifyBundleExistenceByName(bundleName: BundleName): Promise<Result<boolean>> {
        try{
            const account = await this.findOneBy({name:bundleName.Value})
            if(account) return Result.success(true)
                return Result.success(false)
        }
        catch(e){
            return Result.fail( new NotFoundException('Find bundle by name unsucssessfully'))
        }           
    }
}
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { OrmBundleEntity } from "../../entities/orm-entities/orm-bundle-entity"
import { DataSource, MoreThan, Repository } from "typeorm"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { Result } from "src/common/utils/result-handler/result"
import { OrmBundleMapper } from "../../mapper/orm-mapper/orm-bundle-mapper"
import { FindAllBundlesApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-application-request-dto"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto"


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
    
                if(ormBundle.length==0)
                    return Result.fail( new NotFoundException('bundles empty please try again'))
    
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
                let ormBundle = await this.createQueryBuilder( 'bundle' )
                .innerJoinAndSelect('bundle.products',
                    'bundle_product'
                )
                .where('LOWER(bundle.name) LIKE :title', { name: `%${ criteria.name.toLowerCase().trim() }%` })
                .orderBy( 'bundle.caducityDate', 'DESC' )
                .getMany()

                // console.log(ormBundle)

                ormBundle=ormBundle.slice( criteria.page, criteria.perPage )

                if(ormBundle.length==0)
                    return Result.fail( new NotFoundException('bundles not foudnd please try again'))
    
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
}
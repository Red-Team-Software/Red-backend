import { OrmBundleEntity } from "../../entities/orm-entities/orm-bundle-entity"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { OrmBundleImage } from "../../entities/orm-entities/orm-bundle-image"
import { DataSource, Repository } from "typeorm"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { OrmBundleMapper } from "../../mapper/orm-mapper/orm-bundle-mapper"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { IBundleRepository } from "src/bundle/domain/repository/product.interface.repositry"

export class OrmBundleRepository extends Repository<OrmBundleEntity> implements IBundleRepository{

    private mapper:IMapper <Bundle,OrmBundleEntity>
    private readonly ormBundleImageRepository: Repository<OrmBundleImage>


    constructor(dataSource:DataSource){
        super( OrmBundleEntity, dataSource.createEntityManager() )
        this.mapper=new OrmBundleMapper(dataSource,new UuidGen())
        this.ormBundleImageRepository=dataSource.getRepository( OrmBundleImage )
    }
    async createBundle(bundle: Bundle): Promise<Result<Bundle>> {
        try{
            const entry=await this.mapper.fromDomaintoPersistence(bundle)
            const response= await this.save(entry)
            console.log(response)
            for (const image of entry.images ){
                let response= await this.ormBundleImageRepository.save(image)
            }
            return Result.success(bundle)
        }catch(e){
            return Result.fail( new PersistenceException('Create bundle unsucssessfully') )
        }    }
    async deleteBundleById(id: BundleId): Promise<Result<BundleId>> {
        try {
            const result = this.delete({ id: id.Value })   
            return Result.success(id) 
        } catch (e) {
            return Result.fail(new PersistenceException('Delete bundle unsucssessfully'))
        }

    }
    async updateBundle(bundle: Bundle): Promise<Result<Bundle>> {
        const persis = await this.mapper.fromDomaintoPersistence(bundle)
        try {
            const result = await this.save(persis)
            return Result.success(bundle)
        } catch (e) {
            return Result.fail(new PersistenceException('Update bundle unsucssessfully'))
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
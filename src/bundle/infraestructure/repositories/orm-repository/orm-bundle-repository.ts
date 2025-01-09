import { OrmBundleEntity } from "../../entities/orm-entities/orm-bundle-entity"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { OrmBundleImage } from "../../entities/orm-entities/orm-bundle-image"
import { DataSource, Repository } from "typeorm"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { OrmBundleMapper } from "../../mapper/orm-mapper/orm-bundle-mapper"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { Result } from "src/common/utils/result-handler/result"
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { ICommandBundleRepository } from "src/bundle/domain/repository/bundle.command.repository.interface"

export class OrmBundleRepository extends Repository<OrmBundleEntity> implements ICommandBundleRepository{

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
            for (const image of entry.images ){
                let response= await this.ormBundleImageRepository.save(image)
            }
            return Result.success(bundle)
        }catch(e){
            return Result.fail( new PersistenceException('Create bundle unsucssessfully') )
        }    }
    async deleteBundleById(id: BundleId): Promise<Result<BundleId>> {
        try {
            const result =await this.delete({ id: id.Value }) 

            if(result.affected!==1)
                return Result.fail(new PersistenceException('Delete product unsucssessfully'))

            return Result.success(id) 
        } catch (e) {
            return Result.fail(new PersistenceException('Delete bundle unsucssessfully'))
        }

    }
    async updateBundle(bundle: Bundle): Promise<Result<Bundle>> {
        const persis = await this.mapper.fromDomaintoPersistence(bundle)
        try {

            await this.createQueryBuilder()
            .delete()
            .from('bundle_product')
            .where('bundle_id = :bundle_id', { bundle_id: persis.id })
            .execute();

            await this.ormBundleImageRepository.delete({bundle_id:persis.id})

            const result = await this.upsert(persis,['id'])

            for (const image of persis.images) {
                await this.ormBundleImageRepository.save(image);
            }

            for (const product of persis.products) {
                await this.createQueryBuilder()
                  .insert()
                  .into('bundle_product')
                  .values({ product_id: product.id, bundle_id:persis.id })
                  .execute();
              } 

            
            return Result.success(bundle)

        } catch (e) {
            return Result.fail(new PersistenceException('Update bundle unsucssessfully'))
        }
    }
}
import { Result } from "src/common/utils/result-handler/result";
import { Courier } from "src/courier/domain/aggregate/courier";
import { ICourierRepository } from "src/courier/application/repository/repositories-command/courier-repository-interface";
import { DataSource, Repository } from "typeorm";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { ICourierModel } from "src/courier/application/model/courier-model-interface";
import { OrmCourierEntity } from "../../entities/orm-entities/orm-courier-entity";


export class CourierRepository extends Repository<OrmCourierEntity> implements ICourierRepository {
    
    constructor(
        dataSourse: DataSource,
        private readonly ormMapper: IMapper<Courier,OrmCourierEntity>
    ) {
        super(OrmCourierEntity, dataSourse.createEntityManager());
    }
    
    async saveCourier(courier: Courier, email: string, password:string): Promise<Result<Courier>> {
        try{
            let orm = await this.ormMapper.fromDomaintoPersistence(courier);

            let ormCourier: OrmCourierEntity = OrmCourierEntity.create(
                orm.id,
                orm.name,
                orm.image,
                orm.latitude,
                orm.longitude,
                email,
                password
            );

            await this.save(ormCourier);
            return Result.success(courier);
        }catch(error){
            return Result.fail( new PersistenceException( 'Save courier unsucssessfully' ) );
        }
    }

}
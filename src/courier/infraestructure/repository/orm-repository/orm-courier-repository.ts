import { Result } from "src/common/utils/result-handler/result";
import { Courier } from "src/courier/domain/aggregate/courier";
import { ICourierRepository } from "src/courier/domain/repositories/courier-repository-interface";
import { OrmCourierEntity } from "../../entities/orm-courier-entity";
import { DataSource, Repository } from "typeorm";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";


export class CourierRepository extends Repository<OrmCourierEntity> implements ICourierRepository {
    
    constructor(
        dataSourse: DataSource,
        private readonly ormMapper: IMapper<Courier,OrmCourierEntity>
    ) {
        super(OrmCourierEntity, dataSourse.createEntityManager());
    }
    
    async saveCourier(courier: Courier): Promise<Result<Courier>> {
        try{
            let ormCourier = await this.ormMapper.fromDomaintoPersistence(courier);
            await this.save(ormCourier);
            return Result.success(courier);
        }catch(error){
            return Result.fail( new PersistenceException( 'Save courier unsucssessfully' ) );
        }
    }

}
import { DataSource, Repository } from "typeorm";
import { OrmCourierEntity } from "../../entities/orm-courier-entity";
import { ICourierQueryRepository } from "src/courier/application/query-repository/courier-query-repository-interface";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Courier } from "src/courier/domain/aggregate/courier";
import { Result } from "src/common/utils/result-handler/result";
import { CourierId } from "src/courier/domain/value-objects/courier-id";
import { CourierName } from "src/courier/domain/value-objects/courier-name";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";



export class CourierRepository extends Repository<OrmCourierEntity> implements ICourierQueryRepository{
    
    constructor(
        dataSourse: DataSource,
        private readonly ormMapper: IMapper<Courier,OrmCourierEntity>
    ) {
        super(OrmCourierEntity, dataSourse.createEntityManager());
    }


    async findCourierById(courierId: CourierId): Promise<Result<Courier>> {
        try{
            let ormCourier = await this.findOne({
                where: { id: courierId.courierId },
                relations: ['image'],
            });

            if (!ormCourier) return Result.fail( new NotFoundException('Courier not found') );

            let courier: Courier = await this.ormMapper.fromPersistencetoDomain(ormCourier);

            return Result.success(courier);
        }catch(error){
            return Result.fail( new NotFoundException('Courier not found') );
        }
    }
    
    async findCourierByName(courierName: CourierName): Promise<Result<Courier>> {
        try{
            let ormCourier = await this.findOne({
                where: { name: courierName.courierName },
                relations: ['image'],
            });

            if (!ormCourier) return Result.fail( new NotFoundException('Courier not found') );

            let courier: Courier = await this.ormMapper.fromPersistencetoDomain(ormCourier);

            return Result.success(courier);
        }catch(error){
            return Result.fail( new NotFoundException('Courier not found') );
        }
    }
    
    async findAllCouriers(): Promise<Result<Courier[]>> {
        try{
            let ormCourier = await this.find({});

            if (!ormCourier) return Result.fail( new NotFoundException('Courier not found') );

            let courier: Courier[] = [];
            
            ormCourier.map( async (ormCourier) =>
                courier.push(await this.ormMapper.fromPersistencetoDomain(ormCourier))
            );

            return Result.success(courier);
        }catch(error){
            return Result.fail( new NotFoundException('Courier not found') );
        }
    }

}
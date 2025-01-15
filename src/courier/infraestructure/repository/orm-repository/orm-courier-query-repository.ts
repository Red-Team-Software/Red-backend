import { DataSource, Repository } from "typeorm";
import { OrmCourierEntity } from "../../entities/orm-courier-entity";
import { ICourierQueryRepository } from "src/courier/application/repository/query-repository/courier-query-repository-interface";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Courier } from "src/courier/domain/aggregate/courier";
import { Result } from "src/common/utils/result-handler/result";
import { CourierId } from "src/courier/domain/value-objects/courier-id";
import { CourierName } from "src/courier/domain/value-objects/courier-name";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { OrmCourierMapper } from "../../mapper/orm-courier-mapper/orm-courier-mapper";
import { ICourierModel } from "src/courier/application/model/courier-model-interface";



export class CourierQueryRepository extends Repository<OrmCourierEntity> implements ICourierQueryRepository{
    
    
    private readonly ormMapper = new OrmCourierMapper(new UuidGen())
    
    constructor(
        dataSourse: DataSource,
    ) {
        super(OrmCourierEntity, dataSourse.createEntityManager());
    }

    transformToDatamodel(orm: OrmCourierEntity): ICourierModel {
        return{
            courierId: orm.id,
            courierName: orm.name,
            courierImage: orm.image.image,
            courierDirection:{
                lat: orm.latitude,
                long: orm.longitude,
            },
            email: orm.email,
            password: orm.password,
        };
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
            let ormCourier = await this.find({
                relations: ['image'],
            });

            if (!ormCourier) return Result.fail( new NotFoundException('Courier not found') );

            let courier: Courier[] = [];
            
            for ( let ormCour of ormCourier){
                let r = await this.ormMapper.fromPersistencetoDomain(ormCour);
                courier.push(r);
            }

            return Result.success(courier);
        }catch(error){
            return Result.fail( new NotFoundException('Courier not found') );
        }
    }

    async findCourierByIdDetail(courierId: CourierId): Promise<Result<ICourierModel>> {
        try{
            let ormCourier = await this.findOne({
                where: { id: courierId.courierId },
                relations: ['image'],
            });

            if (!ormCourier) return Result.fail( new NotFoundException('Courier not found') );

            let courier: ICourierModel = this.transformToDatamodel(ormCourier);

            return Result.success(courier);
        }catch(error){
            return Result.fail( new NotFoundException('Courier not found') );
        }
    }

    async findCourierByEmailDetail(email: string): Promise<Result<ICourierModel>> {
        try{
            let ormCourier = await this.findOne({
                where: { email: email },
                relations: ['image'],
            });

            if (!ormCourier) return Result.fail( new NotFoundException('Courier not found') );

            let courier: ICourierModel = this.transformToDatamodel(ormCourier);

            return Result.success(courier);
        }catch(error){
            return Result.fail( new NotFoundException('Courier not found') );
        }
    }

}
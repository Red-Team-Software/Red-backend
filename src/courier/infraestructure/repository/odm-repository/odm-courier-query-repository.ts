import { Model, Mongoose } from 'mongoose';
import { Result } from 'src/common/utils/result-handler/result';
import { OdmCourier, OdmCourierSchema } from '../../entities/odm-entities/odm-courier-entity';
import { ICourierModel } from 'src/courier/application/model/courier-model-interface';
import { ICourierQueryRepository } from 'src/courier/application/repository/query-repository/courier-query-repository-interface';
import { OdmCourierMapper } from '../../mapper/odm-courier-mapper/odm-courier-mapper';
import { Courier } from 'src/courier/domain/aggregate/courier';
import { CourierId } from 'src/courier/domain/value-objects/courier-id';
import { CourierName } from 'src/courier/domain/value-objects/courier-name';
import { NotFoundException } from 'src/common/infraestructure/infraestructure-exception';

export class OdmCourierQueryRepository implements ICourierQueryRepository {

    private readonly model: Model<OdmCourier>;
    private readonly odmMapper: OdmCourierMapper;

        private async trasnformtoDataModel(odmCourier:OdmCourier):Promise<ICourierModel>{
            
            return {
                courierId: odmCourier.id,
                courierName: odmCourier.name,
                courierImage: odmCourier.image,
                courierDirection:{
                    lat: odmCourier.latitude,
                    long: odmCourier.longitude
                },
                email: odmCourier.email,
                password: odmCourier.password
            }
        }


    constructor( mongoose: Mongoose ) { 
        this.model = mongoose.model<OdmCourier>('OdmCourier', OdmCourierSchema),
        this.odmMapper=new OdmCourierMapper()
    }

    async findCourierById(courierId: CourierId): Promise<Result<Courier>> {
        try{
            let odmCourier = await this.model.findOne({id:courierId.courierId});

            if(!odmCourier) 
                return Result.fail(new NotFoundException('Courier not found'));

            let courier = await this.odmMapper.fromPersistencetoDomain(odmCourier);

            return Result.success(courier);

        }catch(e){
            return Result.fail(new NotFoundException('Courier not found'));
        };
    }

    async findCourierByName(courierName: CourierName): Promise<Result<Courier>> {
        try{
            let odmCourier = await this.model.findOne({name:courierName.courierName});

            if(!odmCourier) 
                return Result.fail(new NotFoundException('Courier not found'));

            let courier = await this.odmMapper.fromPersistencetoDomain(odmCourier);

            return Result.success(courier);

        }catch(e){
            return Result.fail(new NotFoundException('Courier not found'));
        };
    }

    async findAllCouriers(): Promise<Result<Courier[]>> {
        try{
            let odmCouriers = await this.model.find();

            if(!odmCouriers) 
                return Result.fail(new NotFoundException('Couriers not found'));

            let couriers: Courier[] = [];  
            
            for ( let odmCour of odmCouriers){
                couriers.push(await this.odmMapper.fromPersistencetoDomain(odmCour));
            }

            return Result.success(couriers);

        }catch(e){
            return Result.fail(new NotFoundException('Couriers not found'));
        };
    }

    async findCourierByIdDetail(courierId: CourierId): Promise<Result<ICourierModel>> {
        try{
            let odmCourier = await this.model.findOne({id:courierId.courierId});

            if(!odmCourier) 
                return Result.fail(new NotFoundException('Courier not found'));

            let courier = await this.trasnformtoDataModel(odmCourier);

            return Result.success(courier);

        }catch(e){
            return Result.fail(new NotFoundException('Courier not found'));
        };
    }

    async findCourierByEmailDetail(email: string): Promise<Result<ICourierModel>> {
        try{
            let odmCourier = await this.model.findOne({email: email});

            if(!odmCourier) 
                return Result.fail(new NotFoundException('Courier not found'));

            let courier = await this.trasnformtoDataModel(odmCourier);

            return Result.success(courier);

        }catch(e){
            return Result.fail(new NotFoundException('Courier not found'));
        };
    }

   

}
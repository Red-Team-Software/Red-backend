import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ICourierRepository } from "src/courier/application/repository/repositories-command/courier-repository-interface";
import { ICourierQueryRepository } from "../repository/query-repository/courier-query-repository-interface";
import { CourierId } from '../../domain/value-objects/courier-id';
import { NotFoundCourierApplicationException } from "../application-exceptions/not-found-courier-application.exception";
import { ModifyCourierLocationRequestDto } from "../dto/request/modify-courier-location-request.dto";
import { ModifyCourierLocationResponseDto } from "../dto/response/modify-courier-location-response.dto";
import { CourierDirection } from "src/courier/domain/value-objects/courier-direction";
import { ErrorModifingCourierApplicationException } from "../application-exceptions/error-modifing-courier-location.application.exception";



export class ModifyCourierLocationApplicationService extends IApplicationService<ModifyCourierLocationRequestDto,ModifyCourierLocationResponseDto>{

    constructor(
        private readonly courierRepository:ICourierRepository,
        private readonly courierQueryRepository: ICourierQueryRepository,
        private readonly eventPublisher: IEventPublisher
    ){
        super()
    }

    async execute(data: ModifyCourierLocationRequestDto): Promise<Result<ModifyCourierLocationResponseDto>> {
        
        let response = await this.courierQueryRepository.findCourierById(CourierId.create(data.courierId));

        if (!response.isSuccess()) return Result.fail(new NotFoundCourierApplicationException());

        let courier = response.getValue;

        let courierModel = await this.courierQueryRepository.findCourierByIdDetail(CourierId.create(data.courierId));

        let location = CourierDirection.create(data.lat, data.long);

        courier.updateLocation(location);

        let result = await this.courierRepository.saveCourier(courier, courierModel.getValue.email, courierModel.getValue.password);

        if (!result.isSuccess()) 
            return Result.fail(new ErrorModifingCourierApplicationException());

        this.eventPublisher.publish(courier.pullDomainEvents());

        let responseDto: ModifyCourierLocationResponseDto = {
            courierId: courier.getId().courierId,
            lat: data.lat,
            long: data.long
        };

        return Result.success(responseDto);
    }

}
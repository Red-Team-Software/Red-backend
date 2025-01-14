import { ByIdDTO } from "src/common/infraestructure/dto/entry/by-id.dto";

export class AddUserCouponInfraestructureRequestDTO extends ByIdDTO{
    userid: string;
    couponid: string;
}
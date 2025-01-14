import { IServiceResponseDto } from 'src/common/application/services';
import { UserCard } from 'src/user/application/types/user-card-type';


export class UserCardsApplicationResponseDTO implements IServiceResponseDto, UserCard{
    id: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}
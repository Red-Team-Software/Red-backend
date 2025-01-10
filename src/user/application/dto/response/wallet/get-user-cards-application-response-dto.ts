import { IServiceResponseDto } from 'src/common/application/services';
import { UserCard } from 'src/user/application/types/user-card-type';


export class UserCardsApplicationResponseDTO implements IServiceResponseDto{
    
    constructor(cards: UserCard[]) {}

}
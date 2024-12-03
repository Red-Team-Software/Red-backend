import { ApiProperty } from '@nestjs/swagger'
import { UserRoles } from 'src/user/domain/value-object/enum/user.roles'

export class CurrentUserInfraestructureResponseDTO {
    

    @ApiProperty({ example: '65302e02-69e4-4c6a-9096-2ce00427d498' })
    id: string
    @ApiProperty({ example: 'alfredo@gmail.com' })
    email: string
    @ApiProperty({ example: 'Alfredo' })
    name: string
    @ApiProperty({ example: '04121234567' })
    phone: string
    @ApiProperty({ example: 'fb.com/none.jpg/' })
    image: string
    @ApiProperty({ example: 'client' })
    type: UserRoles
    @ApiProperty({ example: 'client' })
    wallet: {
        walletId: string,
        Ballance:{
          currency: string,
          amount: number
        }
    }
}
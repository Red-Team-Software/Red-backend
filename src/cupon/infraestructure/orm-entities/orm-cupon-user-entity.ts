import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrmCuponEntity } from "./orm-cupon-entity";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";

@Entity('cupon_user')
export class OrmCuponUserEntity {
    @PrimaryColumn('uuid')
    cupon_user_id: string; // Identificador único combinado de cupon_id y user_id

    @ManyToOne(() => OrmCuponEntity, (cupon) => cupon.cupon_users, { eager: true })
    @JoinColumn({ name: 'cupon_id' })
    cupon: OrmCuponEntity;

    @ManyToOne(() => OrmUserEntity, (user) => user.user_cupons)
    @JoinColumn({ name: 'user_id' })
    user: OrmUserEntity;
    
    @Column('uuid')
    cupon_id: string;

    @Column('uuid')
    user_id: string;

    @Column('integer')
    discount: number;

    @Column('string')
    state:string;

    static create(
        cuponUserId: string,
        userId: string,
        cuponId: string,
        discount: number,
        state:string
    ): OrmCuponUserEntity {
        const cuponUser = new OrmCuponUserEntity();
        cuponUser.cupon_user_id = cuponUserId;
        cuponUser.user_id = userId;
        cuponUser.cupon_id = cuponId;
        cuponUser.discount = discount;
        cuponUser.state = state;
        return cuponUser;
    }
}

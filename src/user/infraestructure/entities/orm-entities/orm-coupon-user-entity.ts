import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { OrmCuponEntity } from "src/cupon/infraestructure/orm-entities/orm-cupon-entity";
import { CuponUserStateEnum } from "src/user/domain/entities/coupon/value-objects/enum/cupon-user-state.enum";

@Entity('cupon_user')
export class OrmCuponUserEntity {
    @PrimaryColumn('uuid')
    cupon_user_id: string; // Identificador único combinado de cupon_id y user_id

    @ManyToOne(() => OrmCuponEntity, (cupon) => cupon, { eager: true })
    @JoinColumn({ name: 'cupon_id' })
    cupon: OrmCuponEntity;

    @ManyToOne(() => OrmUserEntity, (user) => user.cupon)
    @JoinColumn({ name: 'user_id' })
    user: OrmUserEntity;
    
    @Column('uuid')
    cupon_id: string;

    @Column('uuid')
    user_id: string;

    @Column('integer')
    discount: number;

    @Column({ type: 'enum', enum: CuponUserStateEnum, default: CuponUserStateEnum.active })
    state: string;

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
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { OrmCuponEntity } from "src/cupon/infraestructure/orm-entities/orm-cupon-entity";
import { CuponUserStateEnum } from "src/user/domain/entities/coupon/value-objects/enum/cupon-user-state.enum";

@Entity('cupon_user')
export class OrmCuponUserEntity {
    
    @ManyToOne(() => OrmCuponEntity, (cupon) => cupon.user)
    @JoinColumn({ name: 'cupon_id' })
    cupon: OrmCuponEntity;

    @ManyToOne(() => OrmUserEntity, (user) => user.cupon)
    @JoinColumn({ name: 'user_id' })
    user: OrmUserEntity;
    
    @PrimaryColumn('uuid')
    cupon_id: string;

    @PrimaryColumn('uuid')
    user_id: string;

    @Column({ type: 'enum', enum: CuponUserStateEnum, default: CuponUserStateEnum.active })
    state: string;

    static create(
        userId: string,
        cuponId: string,
        state: string
    ): OrmCuponUserEntity {
        const cuponUser = new OrmCuponUserEntity();
        cuponUser.user_id = userId;
        cuponUser.cupon_id = cuponId;
        cuponUser.state = state;
        return cuponUser;
    }
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity";
import { OrmCuponEntity } from "./orm-cupon-entity";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";


@Entity('order_bundle')
export class OrmCuponUserEntity {

    @ManyToOne(() => OrmCuponEntity, (cupon) => cupon.cupon_users, { eager: true })
    @JoinColumn({ name: 'cupon_id' })
    cupon: OrmCuponEntity;

    @ManyToOne(() => OrmUserEntity, (user) => user.user_cupons)
    @JoinColumn({ name: 'user_id' })
    user: OrmUserEntity;
    
    @PrimaryColumn('uuid')
    cupon_id: string;

    @PrimaryColumn('uuid')
    user_id: string;

    @Column('integer')
    quantity: number; // Cantidad de productos en la orden

    static create(
        userId: string,
        cuponId: string
    ): OrmCuponUserEntity {
        const cuponUser = new OrmCuponUserEntity();
        cuponUser.user_id=userId;
        cuponUser.cupon_id=cuponId;
        return cuponUser;
    }
}
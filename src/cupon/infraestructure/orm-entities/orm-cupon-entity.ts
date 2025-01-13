import { CouponStateEnum } from "src/cupon/domain/value-object/enum/coupon.state.enum";
import { OrmOrderEntity } from "src/order/infraestructure/entities/orm-order-entity";
import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";

@Entity('cupon')
export class OrmCuponEntity {
    @PrimaryColumn({ type: "uuid" })
    id: string;

    @Column({ type: "varchar", unique: true, length: 50 })
    code: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "numeric" })
    discount: number;

    @Column({ type: 'enum', enum: CouponStateEnum, default: CouponStateEnum.avaleable })
    state: string;

    @OneToOne( () => OrmOrderEntity, (order) => order.cupon, { nullable: true } )
    order?: OrmOrderEntity;

    static create(id: string, code: string, name: string, discount: number, state: string): OrmCuponEntity {
        const cupon = new OrmCuponEntity();
        cupon.id = id;
        cupon.code = code;
        cupon.name = name;
        cupon.discount = discount;
        cupon.state = state;
        return cupon;
    }
}

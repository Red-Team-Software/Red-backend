import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { OrmCuponUserEntity } from "./orm-cupon-user-entity";

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

    @Column({ type: "boolean", default: true })
    state: boolean;
    
    @OneToMany( () => OrmCuponUserEntity, (cuponUser) => cuponUser.cupon, {cascade: true} )
    cupon_users?: OrmCuponUserEntity[];
    
    static create(id: string, code: string, name: string, discount: number, state: boolean, cuponUser?: OrmCuponUserEntity[]): OrmCuponEntity {
        const cupon = new OrmCuponEntity();
        cupon.id = id;
        cupon.code = code;
        cupon.name = name;
        cupon.discount = discount;
        cupon.state = state;
        cupon.cupon_users=cuponUser;
        return cupon;
    }
}

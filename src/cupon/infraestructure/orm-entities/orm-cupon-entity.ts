import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";

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
    
    @ManyToOne( () => OrmUserEntity, (user) => user.orders, {eager: true} )
    @JoinColumn({ name: 'userId' })
    user: OrmUserEntity;
    
    static create(id: string, code: string, name: string, discount: number, state: boolean): OrmCuponEntity {
        const cupon = new OrmCuponEntity();
        cupon.id = id;
        cupon.code = code;
        cupon.name = name;
        cupon.discount = discount;
        cupon.state = state;
        return cupon;
    }
}

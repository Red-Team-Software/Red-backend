import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmOrderEntity } from "src/order/infraestructure/entities/orm-entities/orm-order-entity";
import { ICourierInterface } from "../../model-entity/orm-model-entity/courier-interface";


@Entity( 'courier' )
export class OrmCourierEntity implements ICourierInterface{
    @PrimaryColumn({type:"uuid"}) 
    id:string;
    @Column( 'varchar', { unique: true }   ) 
    name: string;

    @Column("varchar")
    image: string;

    @OneToMany( () => OrmOrderEntity, orders => orders.order_courier, {nullable: true} )
    orders?: OrmOrderEntity[];

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;

    @Column( 'varchar', { unique: true }   ) 
    email: string;

    @Column( 'varchar' ) 
    password: string;

    static create ( 
        id:string,
        name: string,
        images:string,
        lat: number,
        long: number,
        email: string,
        password: string
    ): OrmCourierEntity {
        const courier = new OrmCourierEntity();
        courier.id = id;
        courier.name = name;
        courier.image = images;
        courier.latitude = lat;
        courier.longitude = long;
        courier.email = email;
        courier.password = password;
        return courier;
    }
}
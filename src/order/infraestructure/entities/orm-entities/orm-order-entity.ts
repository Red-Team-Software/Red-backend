import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { IOrderInterface } from "../../model-entity/orm-model-entity/order-interface";
import { OrmOrderBundleEntity } from "./orm-order-bundle-entity";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { OrmCourierEntity } from "src/courier/infraestructure/entities/orm-courier-entity";
import { OrmCuponEntity } from "src/cupon/infraestructure/entities/orm-entities/orm-cupon-entity";
import { OrmOrderPayEntity } from "./orm-order-payment";
import { OrmOrderProductEntity } from "./orm-order-product-entity";
import { OrmOrderReportEntity } from "./orm-order-report-entity";

@Entity('order')
export class OrmOrderEntity implements IOrderInterface {
    
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column('varchar')
    state: string;

    @Column('date')
    orderCreatedDate: Date;

    @Column('numeric')
    totalAmount: number;

    @Column('varchar')
    currency: string;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;

    @ManyToOne( () => OrmUserEntity, (user) => user.orders, {eager: true} )
    @JoinColumn({ name: 'userId' })
    user: OrmUserEntity;

    @Column('varchar')
    userId: string;
    
    @OneToOne( () => OrmOrderPayEntity, (pay) => pay.order, { cascade: true, eager: true } )
    @JoinColumn()
    pay?: OrmOrderPayEntity;

    @Column('date', { nullable: true })
    orderReceivedDate?: Date;

    @OneToMany( () => OrmOrderProductEntity, (orderProduct) => orderProduct.order, { cascade: true, eager: true } )
    order_products?: OrmOrderProductEntity[];

    @OneToMany(() => OrmOrderBundleEntity, (orderBundle) => orderBundle.order, { cascade: true, eager: true } )
    order_bundles?: OrmOrderBundleEntity[]

    @OneToOne( () => OrmOrderReportEntity, (orderReport) => orderReport.order, { cascade: true, eager: true })
    @JoinColumn()
    order_report?: OrmOrderReportEntity;

    @OneToOne( () => OrmCourierEntity, (courier) => courier.orders, { nullable: true, eager: true} )
    @JoinColumn({ name: 'courier_id' })
    order_courier?: OrmCourierEntity | null;

    @Column( 'uuid', { nullable: true } )
    courier_id?: string;

    @OneToOne( () => OrmCuponEntity, (cupon) => cupon.order, { nullable: true } )
    @JoinColumn({ name: 'cupon_id' })
    cupon?: OrmCuponEntity | null;

    @Column( 'uuid', { nullable: true } )
    cupon_id?: string;

    static create(
        id: string,
        orderState: string,
        orderCreatedDate: Date,
        totalAmount: number,
        currency: string,
        latitude: number,
        longitude: number,
        orderUser: OrmUserEntity,
        cuponId?: string,
        courierId?: string,
        pay?: OrmOrderPayEntity,
        orderProducts?: OrmOrderProductEntity[],
        orderBundles?: OrmOrderBundleEntity[],
        orderReceivedDate?: Date,
        orderReport?: OrmOrderReportEntity
    ): OrmOrderEntity {
        const order = new OrmOrderEntity();
        order.id = id;
        order.state = orderState;
        order.orderCreatedDate = orderCreatedDate;
        order.totalAmount = totalAmount;
        order.currency = currency;
        order.latitude = latitude;
        order.longitude = longitude;
        order.courier_id = courierId;
        order.cupon_id = cuponId;
        order.user = orderUser;
        order.pay = pay;
        order.order_products = orderProducts;
        order.order_bundles = orderBundles;
        order.orderReceivedDate = orderReceivedDate;
        order.order_report = orderReport;
        return order;
    }

}
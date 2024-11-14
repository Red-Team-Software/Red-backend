import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrmOrderEntity } from "./orm-order-entity";
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity";


@Entity('order_bundle')
export class OrmOrderBundleEntity {

    @ManyToOne(() => OrmOrderEntity, (order) => order.order_bundles)
    @JoinColumn({ name: 'order_id' })
    order: OrmOrderEntity;

    @ManyToOne(() => OrmBundleEntity, (bundle) => bundle.order_bundles)
    @JoinColumn({ name: 'bundle_id' })
    bundle: OrmBundleEntity;
    
    @PrimaryColumn('uuid')
    order_id: string;

    @PrimaryColumn('uuid')
    bundle_id: string;

    @Column('integer')
    quantity: number; // Cantidad de productos en la orden

    static create(
        order: string,
        bundle: string,
        quantity: number
    ): OrmOrderBundleEntity {
        const orderProduct = new OrmOrderBundleEntity();
        orderProduct.order_id = order;
        orderProduct.bundle_id = bundle;
        orderProduct.quantity = quantity;
        return orderProduct;
    }
}
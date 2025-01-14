import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrmOrderEntity } from "./orm-order-entity";


@Entity('order_product')
export class OrmOrderProductEntity {

    @ManyToOne(() => OrmOrderEntity, (order) => order.order_products)
    @JoinColumn({ name: 'order_id' })
    order: OrmOrderEntity;

    @ManyToOne(() => OrmProductEntity, (product) => product.order_products, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: OrmProductEntity;
    
    @PrimaryColumn('uuid')
    order_id: string;

    @PrimaryColumn('uuid')
    product_id: string;

    @Column('integer')
    quantity: number; // Cantidad de productos en la orden

    @Column('numeric')
    price: number

    @Column('varchar')
    currency: string

    static create(
        order: string,
        product: string,
        quantity: number,
        price: number,
        currency: string
    ): OrmOrderProductEntity {
        const orderProduct = new OrmOrderProductEntity();
        orderProduct.order_id = order;
        orderProduct.product_id = product;
        orderProduct.quantity = quantity;
        orderProduct.price = price;
        orderProduct.currency = currency;
        return orderProduct;
    }
}
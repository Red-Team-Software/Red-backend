import { Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmOrderEntity } from "./orm-order-entity";
import { IOrderReport } from "../../model-entity/orm-model-entity/order-report-interface";


@Entity('order_report')
export class OrmOrderReportEntity implements IOrderReport {
    @PrimaryColumn('uuid')
    id: string;

    @Column('text')
    description: string;

    @JoinColumn( {name: 'order_id'} )
    order: OrmOrderEntity;

    @Column('varchar')
    order_id: string;

    static create(
        id: string,
        description: string,
        order_id: string
    ): OrmOrderReportEntity {
        const orderReport = new OrmOrderReportEntity();
        orderReport.id = id;
        orderReport.description = description;
        orderReport.order_id = order_id;
        return orderReport;
    }
}
import { Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";
import { IOrderReport } from "../orm-model-entity/order-report-interface";
import { OrmOrderEntity } from "./orm-order-entity";


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
        description: string
    ): OrmOrderReportEntity {
        const orderReport = new OrmOrderReportEntity();
        orderReport.id = id;
        orderReport.description = description;
        return orderReport;
    }
}
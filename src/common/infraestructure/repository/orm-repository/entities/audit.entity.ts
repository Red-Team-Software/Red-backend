import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('audit')
export class AuditEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    message: string;
}
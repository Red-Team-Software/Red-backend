import { IAuditRepository } from "src/common/application/repositories/audit.repository";
import { DataSource, Repository } from "typeorm";
import { AuditEntity } from "../entities/audit.entity";

export class OrmAuditRepository extends Repository<AuditEntity> implements IAuditRepository {

    constructor(dataSource: DataSource) {
        super(AuditEntity, dataSource.manager)

    }

    async saveLog(message: string): Promise<void> {
        try {
            await this.save({message});
        } catch(err) {
            throw new Error('error al guardar el log')
        }
    }

}
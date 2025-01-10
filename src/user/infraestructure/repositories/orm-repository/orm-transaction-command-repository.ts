import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/utils/result-handler/result";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { OrmTransactionEntity } from "../../entities/orm-entities/orm-transaction-entity";
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITransaction } from "src/user/application/model/transaction-interface";


export class OrmTransactionCommandRepository extends Repository<OrmTransactionEntity> implements ICommandTransactionRepository<ITransaction>{


    constructor(dataSource:DataSource){
        super(OrmTransactionEntity, dataSource.createEntityManager())
    }
    
    async saveTransaction(entry: ITransaction): Promise<Result<ITransaction>> {
        try{

            if (!entry.payment_method_id) {
                entry.payment_method_id = null; // Asignar null si no hay valor (si la base de datos permite nulos)
            }

            let ormTransaction = OrmTransactionEntity.create(
                entry.id,
                entry.currency,
                entry.price,
                entry.wallet_id,
                entry.date,
                entry.payment_method_id
            )

            this.save(ormTransaction);

            return Result.success(entry);
        }catch(e){
            return Result.fail( new PersistenceException('Create transaction unsucssessfully') )
        };
    }
    

}
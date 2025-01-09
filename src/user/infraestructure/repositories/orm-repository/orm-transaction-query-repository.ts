import { DataSource, Repository } from "typeorm"
import { IAccount } from "src/auth/application/model/account.interface"
import { Result } from "src/common/utils/result-handler/result"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"
import { ITransaction } from "src/user/application/model/transaction-interface"
import { IQueryTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction-query-repository.interface"
import { OrmTransactionEntity } from "../../entities/orm-entities/orm-transaction-entity"



export class OrmTransactionQueryRepository extends Repository<OrmTransactionEntity> implements IQueryTransactionRepository<ITransaction>{

    constructor(dataSource:DataSource){
        super(OrmTransactionEntity, dataSource.createEntityManager())
    }
    
    async getTransactionById(id: string): Promise<Result<ITransaction>> {
        try{
            let transaction = await this.findOneBy({id});
            
            if (!transaction)
                return Result.fail( new NotFoundException('Find transaction by id unsucssessfully'));

            let trans: ITransaction = {
                id: transaction.id,
                currency: transaction.currency,
                price: transaction.price,
                wallet_id: transaction.wallet_id,
                payment_method_id: transaction.payment_method_id,
                date: transaction.date,
            };

            return Result.success(trans);
        }catch(e){
            return Result.fail( new NotFoundException('Find transaction by id unsucssessfully'));
        }
    }


    async getAllTransactionsByWalletId(walletId: string, page: number, perPage: number): Promise<Result<ITransaction[]>> {
        try{

            let transaction = await this.find({
                where: {
                    wallet_id: walletId
                }, 
                skip: page, take: perPage
            });
            
            if (!transaction)
                return Result.fail( new NotFoundException('Find transaction by id unsucssessfully'))
            
            let transactions: ITransaction[] = [];

            transaction.forEach(t => {
                transactions.push({...t})
            });
            
            
            return Result.success(transactions);
        }catch(e){
            return Result.fail( new NotFoundException('Find transaction by id unsucssessfully'))
        }
    }

}
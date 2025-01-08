import { Entity, PrimaryColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { IWallet } from "../../model-entity/orm-model-entity/wallet-interface";
import { OrmWalletEntity } from "./orm-wallet-entity";
import { PaymentMethodEntity } from "src/payment-methods/infraestructure/entity/orm-entity/orm-payment-method-entity";
import { ITransaction } from "src/user/application/model/transaction-interface";


@Entity('wallet_transaction')
export class OrmTransactionEntity implements ITransaction{
    
    @PrimaryColumn({type:"uuid"})
    id: string;
    
    @Column( 'varchar') currency: string;
    @Column( 'numeric') price: number;
    
    @ManyToOne(() => OrmWalletEntity, wallet => wallet)
    @JoinColumn({name: 'wallet_id'})
    wallet: OrmWalletEntity;
    
    @ManyToOne(() => PaymentMethodEntity, method => method, { nullable: true })
    @JoinColumn({name: 'payment_method_id'})
    payment_method?: PaymentMethodEntity|null;
    
    @Column('varchar')
    wallet_id: string;

    @Column({ type: 'uuid', nullable: true })
    payment_method_id?: string | null;

    @Column("date")
    date: Date;

    static create ( 
        id: string,
        currency:string,
        price: number,
        wallet_id: string,
        date: Date,
        payment_method_id?: string,
    ): OrmTransactionEntity
    {
        const wallet = new OrmTransactionEntity()
        wallet.id = id
        wallet.currency=currency
        wallet.price=price
        wallet.wallet_id = wallet_id
        wallet.payment_method_id = payment_method_id
        wallet.date = date
        return wallet
    }
}
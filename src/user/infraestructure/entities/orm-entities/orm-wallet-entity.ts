import { Entity, PrimaryColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { IWallet } from "../../model-entity/orm-model-entity/wallet-interface";
import { OrmUserEntity } from "./orm-user-entity";



@Entity('wallet')
export class OrmWalletEntity implements IWallet{


    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar') currency: string;
    @Column( 'numeric') price: number;

    @OneToOne(() => OrmUserEntity, user => user) 

    static create ( 
        id:string,
        currency:string,
        price: number
    ): OrmWalletEntity
    {
        const wallet = new OrmWalletEntity()
        wallet.id=id
        wallet.currency=currency
        wallet.price=price
        return wallet
    }
}
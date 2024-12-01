import { ISession } from "src/auth/application/model/session.interface";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrmAccountEntity } from './orm-account-entity';


@Entity( { name: 'session' } )
export class OrmSessionEntity implements ISession{
    
    @PrimaryColumn({type:"uuid"}) id: string;
    @Column( 'timestamp', { default: () => 'CURRENT_TIMESTAMP' } ) expired_at: Date;
    @Column( 'varchar',{nullable:true}) push_token: string;
    @ManyToOne( () => OrmAccountEntity ) @JoinColumn( {name:'accountId'} ) account: OrmAccountEntity
    @Column( 'varchar' ) accountId: string;
    
    static create ( 
        id: string,
        expired_at: Date,
        push_token: string,
        accountId:string
    ): OrmSessionEntity
    {
        const session = new OrmSessionEntity()
        session.id=id
        session.expired_at=expired_at
        session.push_token=push_token
        session.accountId=accountId
        return session
    }
}
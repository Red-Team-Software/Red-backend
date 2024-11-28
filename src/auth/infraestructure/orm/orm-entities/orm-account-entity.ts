import { IAccount } from "src/auth/application/model/account.interface";
import { ISession } from "src/auth/application/model/session.interface";
import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('account')
export class OrmAccountEntity implements IAccount{
    sessions: ISession[];
    @PrimaryColumn({type:"uuid"}) id: string;
    @Column( 'varchar') email: string;
    @Column( 'varchar') password: string;
    @Column( 'timestamp', { default: () => 'CURRENT_TIMESTAMP' } )  created_at: Date;
    @Column( 'boolean') isConfirmed: boolean;

    static create ( 
        sessions: ISession[] ,
        id: string,
        email: string,
        password: string,
        created_at: Date,
        isConfirmed:boolean,
    ): OrmAccountEntity
    {
        const account = new OrmAccountEntity()
        account.sessions=sessions
        account.id=id
        account.email=email
        account.password=password
        account.created_at=created_at
        account.isConfirmed=isConfirmed
        return account
    }
}
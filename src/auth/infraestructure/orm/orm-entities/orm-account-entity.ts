import { IAccount } from "src/auth/application/model/account.interface";
import { ISession } from "src/auth/application/model/session.interface";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { OrmSession } from "./orm-session-entity";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";


@Entity('account')
export class OrmAccountEntity implements IAccount{
    @PrimaryColumn({type:"uuid"}) id: string;
    @Column( 'varchar', {unique:true}) email: string;
    @Column( 'varchar') password: string;
    @Column( 'timestamp', { default: () => 'CURRENT_TIMESTAMP' } )  created_at: Date;
    @Column( 'boolean')  isConfirmed: boolean;
    @Column( 'varchar' ) idUser: string;

    @OneToMany( () => OrmSession, session => session.account,{ eager: true })  
    sessions: ISession[];

    @ManyToOne( () => OrmUserEntity , user=>user.id) @JoinColumn( { name: 'id' } ) 
    user: OrmUserEntity

    static create ( 
        sessions: ISession[] ,
        id: string,
        email: string,
        password: string,
        created_at: Date,
        isConfirmed:boolean,
        idUser:string
    ): OrmAccountEntity
    {
        const account = new OrmAccountEntity()
        account.sessions=sessions
        account.id=id
        account.email=email
        account.password=password
        account.created_at=created_at
        account.isConfirmed=isConfirmed
        account.idUser=idUser
        return account
    }
}
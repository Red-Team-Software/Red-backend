import { IAccount } from "src/auth/application/model/account.interface";
import { ISession } from "src/auth/application/model/session.interface";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { OrmSessionEntity } from "./orm-session-entity";


@Entity('account')
export class OrmAccountEntity implements IAccount{
    @PrimaryColumn({type:"uuid"}) id: string;
    @Column( 'varchar', {unique:true}) email: string;
    @Column( 'varchar') password: string;
    @Column( 'timestamp', { default: () => 'CURRENT_TIMESTAMP' } )  created_at: Date;
    @Column( 'boolean')  isConfirmed: boolean;
    @Column( 'varchar' ) idUser: string;
    @Column( 'varchar' ,{nullable:true}) code: string;
    @Column( 'timestamp', { nullable:true } )  code_created_at: Date;
    @Column( 'varchar' ) idStripe: string;


    @OneToMany( () => OrmSessionEntity, session => session.account,{ eager: true })  
    sessions: ISession[];

    @ManyToOne( () => OrmUserEntity , user=>user.id) @JoinColumn( { name: 'idUser' } ) 
    user: OrmUserEntity

    static create ( 
        sessions: ISession[] ,
        id: string,
        email: string,
        password: string,
        created_at: Date,
        isConfirmed:boolean,
        idUser:string,
        idStripe:string,
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
        account.idStripe=idStripe
        return account
    }
}
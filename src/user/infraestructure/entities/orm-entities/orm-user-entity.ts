import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { IUser } from "../../model-entity/orm-model-entity/user-interface";
import { OrmAccountEntity } from "src/auth/infraestructure/orm/orm-entities/orm-account-entity";
import { OrmDirectionUserEntity } from "./orm-direction-user-entity";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";
import { OrmOrderEntity } from "src/order/infraestructure/entities/orm-entities/orm-order-entity";
import { OrmWalletEntity } from "./orm-wallet-entity";


@Entity('user')
export class OrmUserEntity implements IUser{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar') name:string
    @Column( 'varchar',{unique:true}) phone:string
    @Column( 'varchar', { nullable: true }) image?:string
    @Column({ type: 'enum', enum: UserRoles, default: UserRoles.CLIENT })
    type: UserRoles;

    @OneToMany( () => OrmAccountEntity, account => account.user,{ eager: true, nullable:true })  
    accounts: OrmAccountEntity[];

    @OneToMany( () => OrmDirectionUserEntity, direction => direction.user,{  nullable:true , cascade:true, eager:true})  
    direcction: OrmDirectionUserEntity[];

    @OneToMany( () => OrmOrderEntity, order => order.user)
    orders?: OrmOrderEntity[]

    @OneToOne(() => OrmWalletEntity, wallet => wallet, {eager:true, cascade:true}) 
    @JoinColumn()
    wallet: OrmWalletEntity;

    static create ( 
        id:string,
        name:string,
        phone:string,
        userRole:UserRoles,
        wallet:OrmWalletEntity,
        image?:string,
    ): OrmUserEntity
    {
        const user = new OrmUserEntity()
        user.id=id
        user.name=name
        user.phone=phone
        user.type=userRole
        user.wallet=wallet
        image ? user.image=image : user.image=null
        return user
    }
}
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { IUser } from "../../model-entity/orm-model-entity/user-interface";
import { OrmAccountEntity } from "src/auth/infraestructure/orm/orm-entities/orm-account-entity";


@Entity('user')
export class OrmUserEntity implements IUser{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar') name:string
    @Column( 'varchar',{unique:true}) phone:string
    @Column( 'varchar', { nullable: true }) image?:string

    @OneToMany( () => OrmAccountEntity, account => account.user,{ eager: true, nullable:true })  
    accounts: OrmAccountEntity[];

    static create ( 
        id:string,
        name:string,
        phone:string,
        image?:string
    ): OrmUserEntity
    {
        const user = new OrmUserEntity()
        user.id=id
        user.name=name
        user.phone=phone
        image ? user.image=image : user.image=null
        return user
    }
}
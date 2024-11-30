import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { IUser } from "../../model-entity/orm-model-entity/user-interface";
import { OrmAccountEntity } from "src/auth/infraestructure/orm/orm-entities/orm-account-entity";
import { OrmDirectionUserEntity } from "../../model-entity/orm-model-entity/orm-direction-user-entity";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";


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

    @OneToMany( () => OrmDirectionUserEntity, direction => direction.direction,{ eager: true, nullable:true })  
    direcction: OrmDirectionUserEntity[];

    static create ( 
        id:string,
        name:string,
        phone:string,
        userRole:UserRoles,
        image?:string,
    ): OrmUserEntity
    {
        const user = new OrmUserEntity()
        user.id=id
        user.name=name
        user.phone=phone
        user.type=userRole
        image ? user.image=image : user.image=null
        return user
    }
}
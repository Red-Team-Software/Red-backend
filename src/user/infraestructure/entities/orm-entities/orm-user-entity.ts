import { ISession } from "src/auth/application/model/session.interface";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IUser } from "../../model-entity/orm-model-entity/user-interface";


@Entity('user')
export class OrmUserEntity implements IUser{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'varchar') email:string
    @Column( 'varchar') name:string
    @Column( 'varchar') phone:string
    @Column( 'varchar', { nullable: true }) image?:string

    static create ( 
        id:string,
        email:string,
        name:string,
        phone:string,
        image?:string
    ): OrmUserEntity
    {
        const user = new OrmUserEntity()
        user.id=id
        user.email=email
        user.name=name
        user.phone=phone
        if(image)
            user.image=image
        return user
    }
}
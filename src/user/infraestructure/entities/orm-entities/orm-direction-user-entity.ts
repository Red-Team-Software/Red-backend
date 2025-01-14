import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { OrmUserEntity } from "./orm-user-entity";
import { IUserDirection } from "src/user/application/model/user.direction.interface";


@Entity('direction_user')
export class OrmDirectionUserEntity implements IUserDirection {

    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => OrmUserEntity , (user) => user.direcction)
    @JoinColumn({ name: 'user_id' })
    user: OrmUserEntity;
    
    @PrimaryColumn('uuid')
    user_id: string;

    @Column('bool')
    isFavorite:boolean

    @Column('varchar')
    name:string

    @Column( 'numeric') 
    lat: number;
    @Column( 'numeric') 
    lng: number;

    static create(
        user_id:string,
        id:string,
        isFavorite:boolean,
        name:string,
        lat:number,
        lng:number
    ): OrmDirectionUserEntity {
        const userdirection = new OrmDirectionUserEntity();
        userdirection.user_id = user_id;
        userdirection.id = id;
        userdirection.isFavorite = isFavorite;
        userdirection.name=name
        userdirection.lat=lat
        userdirection.lng=lng
        return userdirection;
    }
}
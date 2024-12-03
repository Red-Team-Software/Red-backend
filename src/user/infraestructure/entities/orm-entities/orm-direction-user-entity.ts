import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { OrmDirectionEntity } from "./orm-direction-entity";
import { OrmUserEntity } from "./orm-user-entity";


@Entity('direction_user')
export class OrmDirectionUserEntity {

    @ManyToOne(() => OrmUserEntity , (user) => user.direcction)
    @JoinColumn({ name: 'user_id' })
    user: OrmUserEntity;

    @ManyToOne(() => OrmDirectionEntity, (direction) => direction.accounts, {eager:true})
    @JoinColumn({ name: 'direction_id' })
    direction: OrmDirectionEntity;
    
    @PrimaryColumn('uuid')
    user_id: string;

    @PrimaryColumn('uuid')
    direction_id: string;

    @Column('bool')
    isFavorite:boolean

    @Column('varchar')
    name:string

    static create(
        user_id:string,
        direction_id:string,
        isFavorite:boolean,
        name:string,
        direction:OrmDirectionEntity
    ): OrmDirectionUserEntity {
        const userdirection = new OrmDirectionUserEntity();
        userdirection.user_id = user_id;
        userdirection.direction_id = direction_id;
        userdirection.isFavorite = isFavorite;
        userdirection.name=name
        userdirection.direction=direction
        return userdirection;
    }
}
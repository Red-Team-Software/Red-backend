import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { OrmDirectionEntity } from "../../entities/orm-entities/orm-direction-entity";
import { OrmUserEntity } from "../../entities/orm-entities/orm-user-entity";


@Entity('direction_user')
export class OrmDirectionUserEntity {

    @ManyToOne(() => OrmUserEntity, (user) => user.accounts)
    @JoinColumn({ name: 'user_id' })
    user: OrmUserEntity;

    @ManyToOne(() => OrmDirectionEntity, (direction) => direction.accounts)
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
        name:string
    ): OrmDirectionUserEntity {
        const userdirection = new OrmDirectionUserEntity();
        userdirection.user_id = user_id;
        userdirection.direction_id = direction_id;
        userdirection.isFavorite = isFavorite;
        userdirection.name=name
        return userdirection;
    }
}
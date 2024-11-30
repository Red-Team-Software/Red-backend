import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { IDirection } from "../../model-entity/orm-model-entity/direction-interface";
import { OrmDirectionUserEntity } from "../../model-entity/orm-model-entity/orm-direction-user-entity";



@Entity('direction')
export class OrmDirectionEntity implements IDirection{

    @PrimaryColumn({type:"uuid"}) id:string
    @Column( 'numeric') lat: number;
    @Column( 'numeric') lng: number;

    @OneToMany( () => OrmDirectionUserEntity, user => user,{ eager: true, nullable:true })  
    accounts?: OrmDirectionUserEntity[];

    static create ( 
        id:string,
        lat: number,
        lng: number    
    ): OrmDirectionEntity
    {
        const direction = new OrmDirectionEntity()
        direction.id=id
        direction.lat=lat
        direction.lng=lng
        return direction
    }
}
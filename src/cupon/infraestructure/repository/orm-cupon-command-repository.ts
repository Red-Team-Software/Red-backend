import { DataSource, Repository } from "typeorm";
import { OrmCuponEntity } from "../orm-entities/orm-cupon-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser.entity";
import { OrmCuponUserMapper } from "../mapper/orm-cupon-user-mapper"; // Importar el nuevo mapper
import { OrmCuponUserEntity } from "../orm-entities/orm-cupon-user-entity";
import { ICommandCuponRepository } from "src/cupon/domain/repository/command-cupon-repository";
import { CuponUserId } from "src/cupon/domain/entities/cuponUser/value-objects/cuponUserId";

export class OrmCuponCommandRepository extends Repository<OrmCuponEntity> implements ICommandCuponRepository {
    private readonly cuponUserMapper: IMapper<CuponUser, OrmCuponUserEntity>;
    private readonly mapper: IMapper<Cupon,OrmCuponEntity>;
    private readonly mapperCuponUser: IMapper<CuponUser,OrmCuponUserEntity>;
    constructor(dataSource: DataSource, mapper: IMapper<Cupon, OrmCuponEntity>, mapperCuponUser: IMapper<CuponUser, OrmCuponUserEntity>) {
        super(OrmCuponEntity, dataSource.createEntityManager());
        this.mapper = mapper;
        this.mapperCuponUser= mapperCuponUser
    }

    async registerCuponUser(cuponUser: CuponUser): Promise<Result<boolean>> {
        try {
            const ormCuponUser = await this.cuponUserMapper.fromDomaintoPersistence(cuponUser);
            await this.manager.save(ormCuponUser);
            return Result.success(true);
        } catch (e) {
            return Result.fail(new PersistenceException("Save cupon user unsuccessfully"));
        }
    }

    async createCupon(cupon: Cupon): Promise<Result<Cupon>> {
        try {
            const entry = await this.mapper.fromDomaintoPersistence(cupon);
            await this.save(entry);
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new PersistenceException('Create cupon unsuccessfully'));
        }
    }

    async deleteCuponById(id: CuponId): Promise<Result<CuponId>> {
        try {
            const result = await this.delete({ id: id.Value });
            return Result.success(id);
        } catch (e) {
            return Result.fail(new PersistenceException('Delete cupon unsuccessfully'));
        }
    }

    async updateCupon(cupon: Cupon): Promise<Result<Cupon>> {
        try {
            const persis = await this.mapper.fromDomaintoPersistence(cupon);
            await this.manager.save(persis);
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new PersistenceException('Update cupon unsuccessfully'));
        }
    }

    async updateCuponUser(cuponUser: CuponUser): Promise<Result<CuponUser>> {
        try{
            const persis= await this.mapperCuponUser.fromDomaintoPersistence(cuponUser)
            await this.manager.save(persis);
            return Result.success(cuponUser);
        }catch (e){
            return Result.fail(new PersistenceException('Update cuponUser unsuccessfully'))
        }
    }

}

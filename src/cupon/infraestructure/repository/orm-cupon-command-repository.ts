import { DataSource, Repository } from "typeorm";
import { OrmCuponEntity } from "../orm-entities/orm-cupon-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { ICommandCuponRepository } from "src/cupon/domain/repository/command-cupon-repository";

export class OrmCuponCommandRepository extends Repository<OrmCuponEntity> implements ICommandCuponRepository {
    
    private readonly mapper: IMapper<Cupon,OrmCuponEntity>;
    
    constructor(dataSource: DataSource, mapper: IMapper<Cupon, OrmCuponEntity>) {
        super(OrmCuponEntity, dataSource.createEntityManager());
        this.mapper = mapper
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


}

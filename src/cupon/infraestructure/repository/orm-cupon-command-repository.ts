import { DataSource, Repository } from "typeorm";
import { OrmCuponEntity } from "../orm-entities/orm-cupon-entity";
import { ICuponRepository } from "src/cupon/domain/repository/cupon.interface.repository";
import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmCuponMapper } from "../mapper/orm-cupon-mapper";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { NotFoundException, PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { OrmCuponUserMapper } from "../mapper/orm-cupon-user-mapper"; // Importar el nuevo mapper
import { OrmCuponUserEntity } from "../orm-entities/orm-cupon-user-entity";

export class OrmCuponCommandRepository extends Repository<OrmCuponEntity> implements ICuponRepository {
    private readonly cuponUserMapper: IMapper<CuponUser, OrmCuponUserEntity>;
    private readonly mapper: IMapper<Cupon,OrmCuponEntity>;
    constructor(dataSource: DataSource, mapper: IMapper<Cupon, OrmCuponEntity>) {
        super(OrmCuponEntity, dataSource.createEntityManager());
        this.mapper = mapper;
        this.cuponUserMapper = new OrmCuponUserMapper(); // Inicializar el mapper de CuponUser
    }

    async saveCuponUser(cuponUser: CuponUser): Promise<Result<boolean>> {
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
            await this.save(persis);
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new PersistenceException('Update cupon unsuccessfully'));
        }
    }

    async findCuponById(id: CuponId): Promise<Result<Cupon>> {
        try {
            const ormCupon = await this.findOneBy({ id: id.Value });

            if (!ormCupon) {
                return Result.fail(new NotFoundException('Find cupon unsuccessfully'));
            }

            const cupon = await this.mapper.fromPersistencetoDomain(ormCupon);
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new NotFoundException('Find cupon unsuccessfully'));
        }
    }

    async findCuponByCode(cuponCode: CuponCode): Promise<Result<Cupon>> {
        try {
            const ormCupon = await this.findOneBy({ code: cuponCode.Value });

            if (!ormCupon) {
                return Result.fail(new NotFoundException('Find cupon by code unsuccessfully'));
            }

            const cupon = await this.mapper.fromPersistencetoDomain(ormCupon);
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new NotFoundException('Find cupon by code unsuccessfully'));
        }
    }

    async verifyCuponExistenceByCode(cuponCode: CuponCode): Promise<Result<boolean>> {
        try {
            const cupon = await this.findOneBy({ code: cuponCode.Value });
            return Result.success(!!cupon);
        } catch (e) {
            return Result.fail(new NotFoundException('Verify cupon by code unsuccessfully'));
        }
    }

    async verifyCuponExistenceByName(name: CuponName): Promise<Result<boolean>> {
        try {
            const cupon = await this.findOneBy({ name: name.Value });
            return Result.success(!!cupon);
        } catch (e) {
            return Result.fail(new NotFoundException('Verify cupon by code unsuccessfully'));
        }
    }
}

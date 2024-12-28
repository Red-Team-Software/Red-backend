import { DataSource, Repository } from "typeorm";
import { OrmCuponEntity } from "../orm-entities/orm-cupon-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { IQueryCuponRepository } from "src/cupon/domain/query-repository/query-cupon-repository";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";
import { NotFoundCuponApplicationException } from "src/cupon/application/application-exception/not-found-cupon-application-exception";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrmCuponUserEntity } from "../orm-entities/orm-cupon-user-entity";
import { CuponUserId } from "src/cupon/domain/entities/cuponUser/value-objects/cuponUserId";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";

export class OrmCuponQueryRepository extends Repository<OrmCuponEntity> implements IQueryCuponRepository {
    private mapper: IMapper<Cupon, OrmCuponEntity>;

    constructor(dataSource: DataSource, mapper: IMapper<Cupon, OrmCuponEntity>) {
        super(OrmCuponEntity, dataSource.createEntityManager());
        this.mapper = mapper;
    }

    async findCuponUserByUserAndCupon(userId: UserId, cuponId: CuponId): Promise<Result<CuponUser>> {
        try {
            const ormCuponUser = await this.manager.findOne(OrmCuponUserEntity, {
                where: { user_id: userId.Value, cupon_id: cuponId.Value },
            });

            if (!ormCuponUser) {
                return Result.fail(new NotFoundCuponApplicationException());
            }

            const cuponUser = new CuponUser(
                CuponUserId.create(ormCuponUser.user_id, ormCuponUser.cupon_id),
                UserId.create(ormCuponUser.user_id),
                CuponId.create(ormCuponUser.cupon_id),
                CuponDiscount.create(ormCuponUser.discount),
                ormCuponUser.isUsed
            );

            return Result.success(cuponUser);
        } catch (error) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }

    async findAllCupons(criteria: FindAllCuponsApplicationRequestDTO): Promise<Result<Cupon[]>> {
        try {
            const ormCupons = await this.find({
                take: criteria.perPage,
                skip: criteria.page,
            });

            if (ormCupons.length === 0) {
                return Result.fail(new NotFoundCuponApplicationException());
            }

            const cupons: Cupon[] = [];
            for (const cupon of ormCupons) {
                cupons.push(await this.mapper.fromPersistencetoDomain(cupon));
            }

            return Result.success(cupons);
        } catch (e) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }

    async findCuponById(cuponId: CuponId): Promise<Result<Cupon>> {
        try {
            const ormCupon = await this.findOneBy({ id: cuponId.Value });

            if (!ormCupon) {
                return Result.fail(new NotFoundCuponApplicationException());
            }

            const cupon = await this.mapper.fromPersistencetoDomain(ormCupon);
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }

    async verifyCuponExistenceByCode(code: string): Promise<Result<boolean>> {
        try {
            const cupon = await this.findOneBy({ code });
            return Result.success(!!cupon);
        } catch (e) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }

    async findCuponByCode(code: CuponCode): Promise<Result<Cupon>> {
        try {
            const ormCupon = await this.findOneBy({ code: code.Value });

            if (!ormCupon) {
                return Result.fail(new NotFoundCuponApplicationException());
            }

            const cupon = await this.mapper.fromPersistencetoDomain(ormCupon);
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }

    async verifyCuponExistenceByName(name: string): Promise<Result<boolean>> {
        try {
            const cupon = await this.findOneBy({ name });
            return Result.success(!!cupon);
        } catch (e) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }
}

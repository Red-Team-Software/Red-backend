import { DataSource, Repository } from "typeorm";
import { OrmCuponEntity } from "../orm-entities/orm-cupon-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { IQueryCuponRepository } from "src/cupon/application/query-repository/query-cupon-repository";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";
import { NotFoundCuponApplicationException } from "src/cupon/application/application-exception/not-found-cupon-application-exception";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponUser } from "src/cupon/domain/entities/cuponUser/cuponUser.entity";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrmCuponUserEntity } from "../orm-entities/orm-cupon-user-entity";
import { CuponUserId } from "src/cupon/domain/entities/cuponUser/value-objects/cuponUserId";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";
import { FindCuponByIdApplicationRequestDTO } from "src/cupon/application/dto/request/find-cupon-by-id-application-requestdto";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponUserStateEnum } from "src/cupon/domain/entities/cuponUser/value-objects/cupon-state-enum";

export class OrmCuponQueryRepository extends Repository<OrmCuponEntity> implements IQueryCuponRepository {
    private mapper: IMapper<Cupon, OrmCuponEntity>;

    constructor(dataSource: DataSource, mapper: IMapper<Cupon, OrmCuponEntity>) {
        super(OrmCuponEntity, dataSource.createEntityManager());
        this.mapper = mapper;
    }

    async findCuponUserByUserIdAndCuponId(userId: UserId, cuponId: CuponId): Promise<Result<CuponUser>> {
        try {
            const ormCuponUser = await this.manager.findOne(OrmCuponUserEntity, {
                where: { user_id: userId.Value, cupon_id: cuponId.Value },
            });

            if (!ormCuponUser) {
                return Result.fail(new NotFoundCuponApplicationException());
            }

            const cuponUser = CuponUser.create(
                CuponUserId.create(ormCuponUser.user_id, ormCuponUser.cupon_id),
                UserId.create(ormCuponUser.user_id),
                CuponId.create(ormCuponUser.cupon_id),
                CuponDiscount.create(ormCuponUser.discount),
                CuponUserStateEnum.create(ormCuponUser.state)
            );

            return Result.success(cuponUser);
        } catch (error) {
            return Result.fail(new NotFoundCuponApplicationException());}
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

    async findCuponById(criteria: FindCuponByIdApplicationRequestDTO): Promise<Result<Cupon>> {
        try {
            const ormCupon = await this.findOneBy({ id: criteria.id });

            if (!ormCupon) {
                return Result.fail(new NotFoundCuponApplicationException());
            }

            const cupon = await this.mapper.fromPersistencetoDomain(ormCupon);
            return Result.success(cupon);
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

    async verifyCuponExistenceByName(name: CuponName): Promise<Result<boolean>> {
        try {
            const cupon = await this.findOneBy({ name: name.Value });
            return Result.success(!!cupon);
        } catch (e) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }
}

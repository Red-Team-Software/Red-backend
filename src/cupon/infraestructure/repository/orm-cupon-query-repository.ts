import { DataSource, Repository } from "typeorm";
import { OrmCuponEntity } from "../orm-entities/orm-cupon-entity";
import { Result } from "src/common/utils/result-handler/result";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { IQueryCuponRepository } from "src/cupon/application/query-repository/query-cupon-repository";
import { FindAllCuponsApplicationRequestDTO } from "src/cupon/application/dto/request/find-all-cupons-application-RequestDTO";
import { NotFoundCuponApplicationException
 } from "src/cupon/application/application-exception/not-found-cupon-application-exception";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OrmCuponMapper } from "../mapper/orm-cupon-mapper";
import { FindCuponByIdApplicationRequestDTO } from "src/cupon/application/dto/request/find-cupon-by-id-application-requestdto";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";

export class OrmCuponQueryRepository extends Repository<OrmCuponEntity> implements IQueryCuponRepository {
    private mapper: IMapper<Cupon, OrmCuponEntity>;

    constructor(dataSource: DataSource) {
        super(OrmCuponEntity, dataSource.createEntityManager());
        this.mapper = new OrmCuponMapper(new UuidGen);  // Asumiendo que tienes un mapper específico para cupones
    }

    async findAllCupons(criteria: FindAllCuponsApplicationRequestDTO): Promise<Result<Cupon[]>> {
        try {
            const ormCupons = await this.find({
                take: criteria.perPage,
                skip: criteria.page,
            });

            const cupons: Cupon[] = [];
            for (const cupon of ormCupons) {
                cupons.push(await this.mapper.fromPersistencetoDomain(cupon));
            }

            return Result.success(cupons);
        } catch (e) {
            return Result.fail(new NotFoundCuponApplicationException());
        }
    }

    async findCuponById(cuponId:CuponId): Promise<Result<Cupon>> {
        try {
            const ormCupon = await this.findOneBy({ id: cuponId.Value });
            
            if (!ormCupon) 
                return Result.fail(new NotFoundCuponApplicationException())

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
            return Result.fail(new NotFoundException('Find cupon by code unsuccessfully'));
        }
    }

    async verifyCuponExistenceByCode(cuponCode: CuponCode): Promise<Result<boolean>> {
        try {
            const cupon = await this.existsBy({ code: cuponCode.Value });
            return Result.success(cupon);
        } catch (e) {
            return Result.fail(new NotFoundException('Verify cupon by code unsuccessfully'));
        }
    }

}

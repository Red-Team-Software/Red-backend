import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { CreateCuponApplicationRequestDTO } from "../../dto/request/create-cupon-application-requestdto";
import { CreateCuponApplicationResponseDTO } from "../../dto/response/create-cupon-application-responsedto";
import { ICuponRepository } from "src/cupon/domain/repository/cupon.interface.repository";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";
import { CuponState } from "src/cupon/domain/value-object/cupon-state";
import { ErrorCreatingCuponApplicationException } from "../../application-exception/error-creating-cupon-application-exception copy";
import { ErrorNameAlreadyApplicationException } from "../../application-exception/error-name-already-exist-cupon-application-exception";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";

export class CreateCuponApplicationService extends IApplicationService<
  CreateCuponApplicationRequestDTO,
  CreateCuponApplicationResponseDTO
> {
  constructor(
    private readonly eventPublisher: IEventPublisher,
    private readonly cuponRepository: ICuponRepository,
    private readonly idGen: IIdGen<string>
  ) {
    super();
  }

  async execute(
    command: CreateCuponApplicationRequestDTO
  ): Promise<Result<CreateCuponApplicationResponseDTO>> {
    // Verifica si el nombre del cupón ya existe
    let search = await this.cuponRepository.verifyCuponExistenceByName(
      CuponName.create(command.name)
    );

    if (!search.isSuccess()) {
      return Result.fail(new ErrorCreatingCuponApplicationException());
    }

    if (search.getValue) {
      return Result.fail(new ErrorNameAlreadyApplicationException());
    }

    // Generar el cupón
    let id = await this.idGen.genId();
    let cupon = Cupon.registerCupon(
      CuponId.create(id),
      CuponName.create(command.name),
      CuponCode.create(command.code),
      CuponDiscount.create(command.discount),
      CuponState.create(command.state)
    );

    // Guardar el cupón en el repositorio
    let result = await this.cuponRepository.createCupon(cupon);
    console.log(result)
    if (!result.isSuccess()) {
      console.log("aqui")
      return Result.fail(new ErrorCreatingCuponApplicationException());
    }
    await this.eventPublisher.publish(cupon.pullDomainEvents())
    // Preparar la respuesta
    let response: CreateCuponApplicationResponseDTO = {
      code: command.code,
      name: command.name,
      discount: command.discount,
      state: command.state,
    };

    return Result.success(response);
  }
}

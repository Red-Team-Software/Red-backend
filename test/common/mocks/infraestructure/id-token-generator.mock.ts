import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { IJwtGenerator } from 'src/common/application/jwt-generator/jwt-generator.interface';
import { v4 as uuidv4 } from 'uuid';

export class IdTokenGeneratorMock implements IJwtGenerator<string> {
  generateJwt(param: string): string {
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJpZCI6IjQ3YjYxOTNlLTg1YjAtNGVkZS04N2M5LThkMDFlY
    TI5ZDE2YyIsImlhdCI6MTczNjg4Nzg2NCwiZXhwIjoxNzM2OTc
    0MjY0fQ.hAvM-D_Qhy3dysEk-QeKac4jaENNx1gD-2sIm1qgPO4`;
  }
}

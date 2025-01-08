import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { v4 as uuidv4 } from 'uuid';

export class IdGeneratorMock implements IIdGen<string> {
  async genId(): Promise<string> {
    return uuidv4();
  }
}

import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";


export class CryptoMock implements IEncryptor {

  async hashPassword(planePassword: string): Promise<string> {
    return planePassword;
  }
  async comparePlaneAndHash(planePassword: string, hashPassword: string): Promise<boolean> {
    return planePassword === hashPassword;
  }
}

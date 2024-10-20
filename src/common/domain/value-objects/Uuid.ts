// import { ValueObject } from "src/common/domain/value-object";
// import { NullUuidException } from "../exceptions/nullUuid";
// import { InvalidUuidException } from "../exceptions/invalidUuid";

// export class Uuid extends ValueObject<Uuid> {
//   readonly value: string;

//   constructor(value: string) {
//     super();

//     if (!value) { throw new NullUuidException('No se proporcionó un Uuid') /* throw Exception NullUuidException */}

//     if (!this.checkUuidValidity(value)) { throw new InvalidUuidException(`No se proporcionó un Uuid válido: ${value}`) /* throw Exception InvalidUuidException*/}

//     this.value = value;
//   }

//   equals(object: Uuid): boolean {
//     return this.value === object.value;
//   }

//   private checkUuidValidity(uuid: string): boolean {
//     if (uuid.length != 36) {return false};

//     if (uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i) == null) {
//       return false;
//     }

//     return true;
//   }
// }

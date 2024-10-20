// import { ValueObject } from "src/common/domain/value-object";
// import { NullUrlException } from "../exceptions/nullUrl";
// import { InvalidUrlException } from "../exceptions/invalidUrl";

// export class Url extends ValueObject<Url> {
//   readonly url: string;

//   constructor(value: string) {
//     super();

//     if (!value) { throw new NullUrlException('No se proporcionó un Url') /* throw Exception NullUrlException */};

//     if (!value.includes('.')) { throw new InvalidUrlException(`No se proporcionó un Url válido: ${value}`)/* throw Exception InvalidUrlException */}

//     this.url = value;
//   }

//   equals(obj: Url): boolean {
//     return this.url === obj.url;
//   }

// }

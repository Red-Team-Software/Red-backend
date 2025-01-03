import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class EmptyOrderReportDescriptionException extends DomainException{
    constructor()
    {super("The Order Report Description is empty")}
}
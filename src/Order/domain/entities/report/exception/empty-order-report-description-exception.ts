import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class EmptyOrderReportDescriptionException extends DomainException{
    constructor()
    {super("The Order Report Description is empty")}
}
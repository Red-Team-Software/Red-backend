import { NotifierDto } from "../notification-handler/dto/entry/entry";
import { Result } from "../../domain/result-handler/result";
import { NotifierResponse } from "./dto/response/response";

export interface INotifier {
    notify(token: string): Promise<Result<NotifierDto>>;
}
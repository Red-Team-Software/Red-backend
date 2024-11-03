import { Result } from "src/common/utils/result-handler/result"

export interface IEmailSender <L,R> {
    sendEmail(emailReceiver: string): Promise<Result<R>>
    setVariablesToSend(variables:L):void
}
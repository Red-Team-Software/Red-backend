import { EmailSenderCancelOrderEntryDTO } from "src/common/application/email-sender/dto/request/email-sender-cancel-order-request-dto";
import { IEmailSender } from "src/common/application/email-sender/email-sender.interface";
import { Result } from "src/common/utils/result-handler/result";
import * as sgMail from '@sendgrid/mail';
import { NotFoundException } from "../infraestructure-exception/not-found/not-found.exception";
import { envs } from "src/config/envs/envs";


export class SendGridCancelledOrderEmailSender implements IEmailSender<EmailSenderCancelOrderEntryDTO,boolean>{
    public templateId='d-f5233b353e0d40eba083b0750ae5b10b'
    public variables:EmailSenderCancelOrderEntryDTO

    async sendEmail(emailReceiver: string): Promise<Result<boolean>> {
        const msg = {
            to:emailReceiver,
            from: process.env.EMAIL_SENDER, // El correo electrónico desde el que se enviará el mensaje
            templateId: this.templateId,  // ID de la plantilla dinámica
            dynamic_template_data: {
                username:'customer',
                orderId: this.variables.orderid,
                // this.variables.username
            }
        };

        try {
            await sgMail.send(msg);
            return Result.success(true)
        } catch (error) {
            return Result.fail(new NotFoundException('Email could not send correctly'))
        }
    }
    constructor(){
        sgMail.setApiKey(envs.API_KEY_EMAIL_SENDER)
    }
    setVariablesToSend(variavles: EmailSenderCancelOrderEntryDTO): void {
        this.variables=variavles
    }

}
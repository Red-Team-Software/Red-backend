import * as sgMail from '@sendgrid/mail';
import { IEmailSender } from 'src/common/application/email-sender/email-sender.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { NotFoundException } from '../infraestructure-exception';
import { envs } from 'src/config/envs/envs';
import { EmailSenderSendCodeRequestDTO } from 'src/common/application/email-sender/dto/request/email-sender-send-code-dto';


export class SendGridSendCodeEmailSender implements IEmailSender<EmailSenderSendCodeRequestDTO,boolean>{
    public templateId='d-dcbb55335252421bb2af1431e73b93b8'
    public variables:EmailSenderSendCodeRequestDTO

    async sendEmail(emailReceiver: string): Promise<Result<boolean>> {
        const msg = {
            to:emailReceiver,
            from: envs.EMAIL_SENDER, // El correo electrónico desde el que se enviará el mensaje
            templateId: this.templateId,  // ID de la plantilla dinámica
            dynamic_template_data: {
                username:this.variables.username,
                code:this.variables.code
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
    setVariablesToSend(variavles: EmailSenderSendCodeRequestDTO): void {
        this.variables=variavles
    }

}
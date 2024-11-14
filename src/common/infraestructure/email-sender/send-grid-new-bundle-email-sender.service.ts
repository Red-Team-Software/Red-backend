import * as sgMail from '@sendgrid/mail';
import { EmailSenderNewBundleEntryDTO } from 'src/common/application/email-sender/dto/request/email-sender-new-bundle-dto';
import { IEmailSender } from 'src/common/application/email-sender/email-sender.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { NotFoundException } from '../infraestructure-exception';
import { envs } from 'src/config/envs/envs';


export class SendGridNewBundleEmailSender implements IEmailSender<EmailSenderNewBundleEntryDTO,boolean>{
    public templateId='d-7539e527233842a38d6cd89fdd550b0e'
    public variables:EmailSenderNewBundleEntryDTO

    async sendEmail(emailReceiver: string): Promise<Result<boolean>> {
        const msg = {
            to:emailReceiver,
            from: process.env.EMAIL_SENDER, // El correo electrónico desde el que se enviará el mensaje
            templateId: this.templateId,  // ID de la plantilla dinámica
            dynamic_template_data: {
                username:'customer',
                image:this.variables.image,
                name:this.variables.name
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
    setVariablesToSend(variavles: EmailSenderNewBundleEntryDTO): void {
        this.variables=variavles
    }

}
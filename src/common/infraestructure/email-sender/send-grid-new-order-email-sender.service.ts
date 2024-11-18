import * as sgMail from '@sendgrid/mail';
import { IEmailSender } from 'src/common/application/email-sender/email-sender.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { NotFoundException } from '../infraestructure-exception';
import { envs } from 'src/config/envs/envs';
import { EmailSenderNewOrderEntryDTO } from 'src/common/application/email-sender/dto/request/email-sender-new-order-dto';


export class SendGridNewOrderEmailSender implements IEmailSender<EmailSenderNewOrderEntryDTO,boolean>{
    public templateId='d-e878ca198f9849cb8e8a587986c2d42e'
    public variables:EmailSenderNewOrderEntryDTO

    async sendEmail(emailReceiver: string): Promise<Result<boolean>> {
        const msg = {
            to:emailReceiver,
            from: process.env.EMAIL_SENDER, // El correo electrónico desde el que se enviará el mensaje
            templateId: this.templateId,  // ID de la plantilla dinámica
            dynamic_template_data: {
                username:'customer',
                price:this.variables.price,
                currency:this.variables.currency
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
    setVariablesToSend(variavles: EmailSenderNewOrderEntryDTO): void {
        this.variables=variavles
    }

}
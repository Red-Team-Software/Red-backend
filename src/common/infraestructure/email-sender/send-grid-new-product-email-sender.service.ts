import * as sgMail from '@sendgrid/mail';
import { IEmailSender } from 'src/common/application/email-sender/email-sender.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { NotFoundException } from '../infraestructure-exception';
import { envs } from 'src/config/envs/envs';
import { EmailSenderNewProductEntryDTO } from 'src/common/application/email-sender/dto/request/email-sender-new-product-dto';


export class SendGridNewProductEmailSender implements IEmailSender<EmailSenderNewProductEntryDTO,boolean>{
    public templateId='d-023fc1e5e8274c2ca5121e642fd136b2'
    public variables:EmailSenderNewProductEntryDTO

    async sendEmail(emailReceiver: string): Promise<Result<boolean>> {
        const msg = {
            to:emailReceiver,
            from: process.env.EMAIL_SENDER, // El correo electrónico desde el que se enviará el mensaje
            templateId: this.templateId,  // ID de la plantilla dinámica
            dynamic_template_data: {
                username:'customer',
                image:this.variables.image,
                name:this.variables.name,
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
    setVariablesToSend(variavles: EmailSenderNewProductEntryDTO): void {
        this.variables=variavles
    }

}
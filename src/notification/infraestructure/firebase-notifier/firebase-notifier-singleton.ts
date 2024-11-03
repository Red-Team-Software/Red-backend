import * as admin from 'firebase-admin';
import { PushNotifierDto } from 'src/common/application/notification-handler/dto/entry/push-notifier.dto';
import { IPushNotifier } from 'src/common/application/notification-handler/notification-interface';
import { Result } from 'src/common/utils/result-handler/result';

export class FirebaseNotifier implements IPushNotifier {

    private static instance: FirebaseNotifier

    private constructor() {
        const credentials:object = {
            type: process.env.FB_TYPE,
            project_id: process.env.FB_PROJECT_ID,
            private_key_id: process.env.FB_PRIVATE_KEY_ID,
            private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/gm, "\n"),            
            client_email: process.env.FB_CLIENT_EMAIL,
            client_id: process.env.FB_CLIENT_ID,
            auth_uri: process.env.FB_AUTH_URI,
            token_uri: process.env.FB_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER,
            client_x509_cert_url: process.env.FB_CLIENT,
            universe_domain: process.env.FB_DOMAIN
        }        
        admin.initializeApp({ credential: admin.credential.cert(credentials) })
    }

    public static getInstance(): FirebaseNotifier {
        if (!FirebaseNotifier.instance) FirebaseNotifier.instance = new FirebaseNotifier();
        return FirebaseNotifier.instance;
    }

    async sendNotificationByToken(data: PushNotifierDto): Promise<Result<string>> {
        try { 
            admin.messaging().send
            const res = await admin.messaging().send(data)
            return Result.success<string>('push_sended')
        } catch(e) { 
            if ( e.ErrorCode == "messaging/registration-token-not-registered" ) {
                // DELETE TOKEN USER
            }           
            return Result.fail<string>(new Error('error-sending-push'))
        } 
    }

}
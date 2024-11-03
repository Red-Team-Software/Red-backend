import * as admin from 'firebase-admin';
import { PushNotifierRequestDto } from 'src/common/application/notification-handler/dto/request/push-notifier-request-dto';
import { IPushNotifier } from 'src/common/application/notification-handler/notification-interface';
import { Result } from 'src/common/utils/result-handler/result';
import { envs } from 'src/config/envs/envs';

export class FirebaseNotifier implements IPushNotifier {

    private static instance: FirebaseNotifier

    private constructor() {
        const credentials:object = {
            type: envs.FIREBASE_TYPE,
            project_id: envs.FIREBASE_PROJECT_ID,
            private_key_id: envs.FIREBASE_PRIVATE_KEY_ID,
            private_key: envs.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n"),            
            client_email: envs.FIREBASE_CLIENT_EMAIL,
            client_id: envs.FIREBASE_CLIENT_ID,
            auth_uri: envs.FIREBASE_AUTH_URI,
            token_uri: envs.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: envs.FIREBASE_AUTH_PROVIDER,
            client_x509_cert_url: envs.FIREBASE_CLIENT,
            universe_domain: envs.FIREBASE_DOMAIN
        }        
        admin.initializeApp({ credential: admin.credential.cert(credentials) })
    }

    public static getInstance(): FirebaseNotifier {
        if (!FirebaseNotifier.instance) FirebaseNotifier.instance = new FirebaseNotifier();
        return FirebaseNotifier.instance;
    }

    async sendNotificationByToken(data: PushNotifierRequestDto): Promise<Result<string>> {
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
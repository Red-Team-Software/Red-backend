import { Injectable } from '@nestjs/common';
import { FirebaseNotifier } from './notification/infraestructure/firebase-notifier/firebase-notifier-singleton';

@Injectable()
export class AppService {
  getHello(): string {
    let pushservice = FirebaseNotifier.getInstance()
    pushservice.sendNotificationByToken({
      token: 'string',
      notification: { 
          title: 'test', 
          body: 'test-2',
      } 
    })
    return 'Hello World!';
  }
}

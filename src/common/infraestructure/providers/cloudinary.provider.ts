import { ConfigModule, ConfigService } from '@nestjs/config';
import {v2 as cloudinary} from 'cloudinary';
import { envs } from 'src/config/envs/envs';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return cloudinary.config({
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLOUDINARY_API_SECRET
        });
    }
}

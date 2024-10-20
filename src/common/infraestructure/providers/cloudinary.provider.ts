// import { ConfigModule, ConfigService } from '@nestjs/config';
// import {v2 as cloudinary} from 'cloudinary';

// export const CloudinaryProvider = {
//     provide: 'CLOUDINARY',
//     imports: [ConfigModule],
//     inject: [ConfigService],
//     useFactory: (configService: ConfigService) => {
//         return cloudinary.config({
//             cloud_name: configService.getOrThrow('CLOUDINARY_NAME'),
//             api_key: configService.getOrThrow('CLOUDINARY_API_KEY'),
//             api_secret: configService.getOrThrow('CLOUDINARY_API_SECRET')
//         });
//     }
// }

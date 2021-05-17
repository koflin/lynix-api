import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MediaDoc, MediaSchema } from 'src/schemas/media.schema';
import { v4 as uuidv4 } from 'uuid';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: MediaDoc.name, schema: MediaSchema, collection: 'media'
    }]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: diskStorage({
          filename: (req, file, cb) => {
              const id = uuidv4();
              return cb(null, id + path.extname(file.originalname).toLowerCase());
          },
          destination: './' + config.get('media.path')
        })
      })
    }),
  ]
})
export class MediaModule {}

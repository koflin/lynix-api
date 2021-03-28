import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { MediaDoc, MediaSchema } from 'src/schemas/media.schema';

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
    MulterModule.register({
      dest: './media'
    }),
  ]
})
export class MediaModule {}

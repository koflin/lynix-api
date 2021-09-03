import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media } from 'src/models/media.model';
import { MediaDoc } from 'src/schemas/media.schema';
import { UrlDoc } from 'src/schemas/url.schema';

@Injectable()
export class MediaService {
    constructor(
        @InjectModel(MediaDoc.name) private mediaModel: Model<MediaDoc>,
        private config: ConfigService
    ) {
    }

    async create(companyId: string, userId: string, fileName: string) {
        const media = new this.mediaModel();
        media.companyId = companyId;
        media.uploadedBy = userId;
        media.uploadedAt = new Date();
        media.url = new UrlDoc(this.config.get('api.url') + '/media/' + media.id + '/' + fileName);
        media.fileName = fileName;
        await media.save();

        return new Media(media);
    }

    async get(id: string) {
        const { fileName, } = await this.mediaModel.findById(id).exec();
        return fileName;
    }
}

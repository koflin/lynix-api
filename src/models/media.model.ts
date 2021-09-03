import { MediaDoc } from 'src/schemas/media.schema';

export class Media {
    id: string;
    companyId: string;
    
    uploadedBy: string;
    uploadedAt: Date;

    url: string;

    constructor(media: MediaDoc) {
        this.id = media.id;
        this.companyId = media.companyId;

        this.uploadedBy = media.uploadedBy;
        this.uploadedAt = media.uploadedAt;

        this.url = media.url.toString();
    }
  }
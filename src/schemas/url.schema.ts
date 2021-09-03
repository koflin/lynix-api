import { Prop, Schema } from '@nestjs/mongoose';
import { UrlType, urlTypeToPrefix } from 'src/models/url.type';

@Schema()
export class UrlDoc {
    @Prop()
    urlType: UrlType;
    @Prop()
    relativeUrl: string;

    constructor(url: string) {        
        for (const type of Object.values(UrlType)) {
            const prefix = urlTypeToPrefix(type);

            if (url.startsWith(prefix)) {
                this.urlType = type;
                this.relativeUrl = url.substr(prefix.length);
                break;
            }
        }
    }

    static to(url: UrlDoc): string {
        return url ? urlTypeToPrefix(url.urlType) + url.relativeUrl : undefined;
    }
}
import configuration from 'src/config/configuration';

export enum UrlType {
    MEDIA = "media",
    CLIENT = "client",
    API = "api",
    EXTERNAL = "external",
}

const mediaSubUrl = '/media/';

export function urlTypeToPrefix(type: UrlType) {
    const config = configuration();
    
    switch(type) {
        case UrlType.MEDIA:
            return config.api.url + mediaSubUrl;
        
        case UrlType.API:
            return config.api.url + '/';

        case UrlType.CLIENT:
            return config.client.host + '/';

        case UrlType.EXTERNAL:
            return '';
    }
}
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, ValidationOptions } from 'class-validator';
import { UrlType, urlTypeToPrefix } from 'src/models/url.type';
import { UrlDoc } from 'src/schemas/url.schema';

export function IsUrl(allowedUrlTypes: UrlType[], options?: ValidationOptions) {
    const allowedPrefixes = [];

    for (const type of allowedUrlTypes) {
        allowedPrefixes.push(urlTypeToPrefix(type))
    }

    let reg = '^(' + allowedPrefixes.join('|') +').*$';

    reg = reg.replace(/\//g, '\\/');

    return applyDecorators(
        IsNotEmpty(options),
        //Matches(new RegExp(reg), options),
        Transform(({ value }) => {
            
            return options?.each ? (<string[]>value).map(v => new UrlDoc(v)) : new UrlDoc(value);
        }, { toClassOnly: true })
    );
}
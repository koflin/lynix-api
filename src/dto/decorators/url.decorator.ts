import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Matches, ValidationOptions } from 'class-validator';
import { UrlType, urlTypeToPrefix } from 'src/models/url.type';
import { UrlDoc } from 'src/schemas/url.schema';

export function IsUrl(allowedUrlTypes: UrlType[], options?: ValidationOptions) {
    const allowedPrefixes = [];

    for (const type of allowedUrlTypes) {
        allowedPrefixes.push(urlTypeToPrefix(type))
    }

    const reg = '^(' + allowedPrefixes.join('|') +').*$';

    return applyDecorators(
        Matches(reg, undefined, options),
        Transform(({ value }) => options.each ? (<string[]>value).map(v => new UrlDoc(v)) : new UrlDoc(value))
    );
}
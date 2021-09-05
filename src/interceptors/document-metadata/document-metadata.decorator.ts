import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

import { DocumentMetadataType } from './document-metadata';
import { DocumentMetadataInterceptor } from './document-metadata.interceptor';

export const DOCUMENT_METADATA_KEY = 'document_metadata';

export const DocumentMetadata = (...types: DocumentMetadataType[]) => {
    return applyDecorators(
        SetMetadata(DOCUMENT_METADATA_KEY, types),
        UseInterceptors(DocumentMetadataInterceptor)
    );
}
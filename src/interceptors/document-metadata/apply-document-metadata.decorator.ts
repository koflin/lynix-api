import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { EditService } from 'src/core/interfaces/edit-service.interface';

export const APPLY_DOCUMENT_METADAT_KEY = 'apply_document_metadata';

export const ApplyDocumentMetadata = <T extends EditService>(service: Type<T>) => {
    return applyDecorators(
        SetMetadata(APPLY_DOCUMENT_METADAT_KEY, service)
    );
}
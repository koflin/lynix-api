import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EditService } from 'src/core/interfaces/edit-service.interface';

import { APPLY_DOCUMENT_METADAT_KEY } from './apply-document-metadata.decorator';
import { DocumentMetadataType } from './document-metadata';
import { DOCUMENT_METADATA_KEY } from './document-metadata.decorator';

@Injectable()
export class DocumentMetadataInterceptor implements NestInterceptor {

  constructor(private ref: ModuleRef) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap(async (response) => {
        const httpContext = context.switchToHttp();
        const handler = context.getHandler();

        const types: DocumentMetadataType[] = Reflect.getMetadata(DOCUMENT_METADATA_KEY, handler);

        if (types) {
          const service = await this.ref.resolve<EditService>(Reflect.getMetadata(APPLY_DOCUMENT_METADAT_KEY, context.getClass()));

          const userId = httpContext.getRequest().account.id;
          const objectId = response.id;
          const time = new Date();

          const metadata = {};

          const all = types && types.length > 0 && types[0] === DocumentMetadataType.ALL;

          for (const type of types) {
            if (all || type === DocumentMetadataType.CREATED_AT) {
              metadata['createdAt'] = time;
            }
            
            if (all || type === DocumentMetadataType.CREATED_BY) {
              metadata['createdBy'] = userId;
            }

            if (all || type === DocumentMetadataType.EDITED_AT) {
              metadata['editedAt'] = time;
            }

            if (all || type === DocumentMetadataType.EDITED_BY) {
              metadata['editedBy'] = userId;
            }

            if (all || type === DocumentMetadataType.DELETED_AT) {
              metadata['deletedAt'] = time;
            }

            if (all || type === DocumentMetadataType.DELETED_BY) {
              metadata['deletedBy'] = userId;
            }
          }

          response = await service.edit(objectId, metadata);
        }

        return response;
      })
    );
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { MetadataService } from './metadata.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: UserDoc.name, schema: UserSchema, collection: 'users',
    }]),
  ],
  providers: [MetadataService],
  exports: [MetadataService]
})
export class MetadataModule {

}

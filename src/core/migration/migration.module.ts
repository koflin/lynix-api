import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyDoc, CompanySchema } from 'src/schemas/company.schema';
import { MediaDoc, MediaSchema } from 'src/schemas/media.schema';
import { MigrationDoc, MigrationSchema } from 'src/schemas/migration.schema';
import { ProcessDoc, ProcessSchema } from 'src/schemas/process.schema';
import { ProcessTemplateDoc, ProcessTemplateSchema } from 'src/schemas/processTemplate.schema';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { MigrationService } from './migration.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: MigrationDoc.name, schema: MigrationSchema, collection: 'migrations',
    },
    {
      name: UserDoc.name, schema: UserSchema, collection: 'users',
    },
    {
      name: ProcessDoc.name, schema: ProcessSchema, collection: 'processes',
    },
    {
      name: ProcessTemplateDoc.name, schema: ProcessTemplateSchema, collection: 'processTemplates',
    },
    {
      name: MediaDoc.name, schema: MediaSchema, collection: 'media',
    },
    {
      name: CompanyDoc.name, schema: CompanySchema, collection: 'companies',
    }]),
  ],
  providers: [MigrationService]
})
export class MigrationModule {}

import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyDoc, CompanySchema } from 'src/schemas/company.schema';

import { MetadataModule } from '../metadata/metadata.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [
    HttpModule,
    MetadataModule,
    MongooseModule.forFeature([{
      name: CompanyDoc.name, schema: CompanySchema, collection: 'companies'
    }]),
  ],
  exports: [CompaniesService],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}

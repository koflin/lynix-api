import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyDoc, CompanySchema } from 'src/schemas/company.schema';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: CompanyDoc.name, schema: CompanySchema, collection: 'companies'
    }])
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}

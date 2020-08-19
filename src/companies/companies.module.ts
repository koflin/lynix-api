import { Module, HttpModule } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyDoc, CompanySchema } from 'src/schemas/company.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: CompanyDoc.name, schema: CompanySchema, collection: 'companies'
    }]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}

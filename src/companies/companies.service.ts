import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyDoc } from 'src/schemas/company.schema';
import { Model } from 'mongoose';
import { Company } from 'src/models/company.model';

@Injectable()
export class CompaniesService {
    constructor(@InjectModel(CompanyDoc.name) private companyModel: Model<CompanyDoc>, private http: HttpService) {

    }

    getAll(): Promise<Company[]> {
        return this.companyModel.find();
    }
}

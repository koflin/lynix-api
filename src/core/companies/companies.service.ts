import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from 'src/dto/company/createCompanyDto';
import { EditCompanyDto } from 'src/dto/company/editCompanyDto';
import { Company } from 'src/models/company.model';
import { CompanyDoc } from 'src/schemas/company.schema';

@Injectable()
export class CompaniesService {
    constructor(@InjectModel(CompanyDoc.name) private companyModel: Model<CompanyDoc>, private http: HttpService) {
    }

    async getAll(): Promise<Company[]> {
        const companyDoc = await this.companyModel.find().exec();
        return companyDoc.map(doc => new Company(doc));
    }

    async getById(id: string): Promise<Company> {
        const companyDoc = await this.companyModel.findById(id).exec();
        return companyDoc == null ? null : new Company(companyDoc);
    }

    async create(companyDto: CreateCompanyDto): Promise<Company> {
        const companyDoc = new this.companyModel(companyDto);
        return new Company(await companyDoc.save());
    }

    async edit(id: string, company: EditCompanyDto): Promise<Company> {
        const companyDoc = await this.companyModel.findByIdAndUpdate(id, {
            ...company
        }, { new: true, omitUndefined: true }).exec();
        return companyDoc == null ? null : new Company(companyDoc);
    }

    async delete(id: string): Promise<void> {
        await this.companyModel.findByIdAndDelete(id).exec();
        return;
    }
}

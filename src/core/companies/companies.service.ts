import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { doc } from 'prettier';
import { CreateCompanyDto } from 'src/dto/company/createCompanyDto';
import { EditCompanyDto } from 'src/dto/company/editCompanyDto';
import { Company } from 'src/models/company.model';
import { CompanyDoc } from 'src/schemas/company.schema';

import { MetadataService } from '../metadata/metadata.service';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(CompanyDoc.name) private companyModel: Model<CompanyDoc>,
        private http: HttpService,
        private metadataService: MetadataService
    ) {
    }

    async getAll(): Promise<Company[]> {
        const companyIds = await this.companyModel.find({ deletedAt: { $exists: false } }, '_id').exec();
        return Promise.all(companyIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(id: string): Promise<Company> {
        const companyDoc = await this.companyModel.findById(id).exec();
        return companyDoc == null ? null : new Company(await this.metadataService.get(companyDoc), companyDoc);
    }

    async create(companyDto: CreateCompanyDto): Promise<Company> {
        const companyDoc = new this.companyModel(companyDto);
        await companyDoc.save();
        return this.getById(companyDoc.id);
    }

    async edit(id: string, company: EditCompanyDto): Promise<Company> {
        const companyDoc = await this.companyModel.findByIdAndUpdate(id, {
            ...company
        }, { new: true, omitUndefined: true }).exec();
        return companyDoc == null ? null : this.getById(companyDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.companyModel.findByIdAndDelete(id).exec();
        return;
    }
}

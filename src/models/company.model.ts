import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyDoc } from 'src/schemas/company.schema';
import { UrlDoc } from 'src/schemas/url.schema';

import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';

@ObjectType()
export class Company extends MetadataEntity {
    @ApiProperty()
    @Field(type => ID)
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    logo: string;

    constructor(metadata: Metadata, company: CompanyDoc) {
        super(metadata);
        
        this.id = company.id;
        this.name = company.name;
        this.logo = UrlDoc.to(company.logo);
    }
}
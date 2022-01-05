import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Document, Model } from 'mongoose';
import * as path from 'path';
import { CompanyDoc } from 'src/schemas/company.schema';
import { MediaDoc } from 'src/schemas/media.schema';
import { MigrationDoc } from 'src/schemas/migration.schema';
import { ProcessDoc } from 'src/schemas/process.schema';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';
import { UrlDoc } from 'src/schemas/url.schema';
import { UserDoc } from 'src/schemas/user.schema';

const versionHistory = [
    '0.1.0',
    '0.1.1',
    '0.1.2',
    '0.1.3',
    '0.1.4',
    '0.1.5',
    '0.1.6',
    '0.1.7',
    '0.1.8'
];

@Injectable()
export class MigrationService {

    constructor(
        @InjectModel(MigrationDoc.name) private migrationModel: Model<MigrationDoc>,
        @InjectModel(UserDoc.name) private userModel: Model<UserDoc>,
        @InjectModel(ProcessDoc.name) private processModel: Model<ProcessDoc>,
        @InjectModel(ProcessTemplateDoc.name) private processTemplateModel: Model<ProcessTemplateDoc>,
        @InjectModel(MediaDoc.name) private mediaModel: Model<MediaDoc>,
        @InjectModel(CompanyDoc.name) private companyModel: Model<CompanyDoc>,
    ) {

    }

    async migrate() {
        const packageData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8'));
        const softwareVersion = new Version(packageData?.version);

        if (softwareVersion.versionString != versionHistory[versionHistory.length - 1]) {
            throw new NotImplementedException('Complete version History with newest history!');
        }

        const latestUpdate = await this.migrationModel.findOne().sort({ updatedAt: 'desc' }).exec();

        const dbVersion = latestUpdate ? new Version(latestUpdate.version) : new Version(versionHistory[0]);

        if (dbVersion.lower(softwareVersion)) {
            // Update
            const startIndex = versionHistory.indexOf(dbVersion.versionString);

            for (let i = startIndex + 1; i < versionHistory.length; i++) {
                const version = new Version(versionHistory[i]);

                const migration: () => Promise<void> = Reflect.get(this, 'migrate' + version.major + '_' + version.minor + '_' + version.patch);

                if (migration) {
                    console.log('Migrating to version: ' + version.versionString);
                    await migration.call(this);
                }
            }

            console.log('Migrated from ' + dbVersion.versionString + ' to ' + softwareVersion.versionString);

            await this.migrationModel.create({
                updatedFrom: dbVersion.versionString,
                updatedAt: new Date(),
                version: softwareVersion.versionString
            });
        }
    }

    private async migrate0_1_1() {
        // Companies
        let docs: any[] = await this.companyModel.find().exec();
        await modify(docs, 'logo');
        // Media
        docs = await this.mediaModel.find().exec();
        await modify(docs, 'url');
        // Process Templates
        docs = await this.processTemplateModel.find().exec();
        await modify(docs, 'pictureUris', 'stepTemplates');
        await modify(docs, 'videoUris', 'stepTemplates');
        // Processes
        docs = await this.processModel.find().exec();
        await modify(docs, 'pictureUris', 'steps');
        await modify(docs, 'videoUris', 'steps');
        // Users
        docs = await this.userModel.find().exec();
        await modify(docs, 'avatar');

        async function modify(docs: any[] | any, property: string, ...subproperties: string[]) {
            if (!docs) {
                return;
            }

            // FIrst array of docs
            if (Array.isArray(docs)) {
                for (const doc of <Document[]>docs) {
                    await modify(doc, property, ...subproperties);

                    if (subproperties.length > 0) {
                        doc.markModified(subproperties[0]);
                    } else {
                        doc.markModified(property);
                    }
                    
                    await doc.save();
                }
            } else {
                // Subproperty
                if (subproperties.length > 0) {
                    const subProp = subproperties.splice(0, 1)[0];

                    if (Array.isArray(docs[subProp])) {
                        for (const doc of docs[subProp]) {
                            await modify(doc, property, ...subproperties);
                        }
                    } else {
                        await modify(docs[subProp], property, ...subproperties);
                    }
                } else {
                    // Property is Array
                    if (Array.isArray(docs[property])) {
                        const urls: any[] = docs[property];
                        
                        for (let i = 0; i < urls.length; i++) {
                            modifyProp(urls, i);
                        }
                    } else {
                        modifyProp(docs, property);
                    }
                }
            }
        }

        function modifyProp(object: any, index: string | number) {
            const value = object[index];

            if (!value || (value.urlType != undefined && value.relativeUrl != undefined)) {
                return;
            }

            if (!value.startsWith('http')) {
                object[index] = undefined;
            } else {
                object[index] = new UrlDoc(value);
            }
        }
    }

    private async migrate0_1_2() {
        await this.processTemplateModel.updateMany({ stepTemplates: { $exists: true } }, { $rename: { 'stepTemplates': 'steps' } }, { strict: false }).exec();
    }

    private async migrate0_1_9() {
        // Rename process.occupiedBy to process.occupiedById
        await this.processModel.updateMany({ occupiedBy: { $exists: true } }, { $rename: { 'occupiedBy': 'occupiedById' }}, { strict: false }).exec();
    }
}

class Version {
    major: number;
    minor: number;
    patch: number;

    public versionString: string;

    constructor(version: string) {
        const parts = version.split('.');

        this.major = parseInt(parts[0]);
        this.minor = parseInt(parts[1]);
        this.patch = parseInt(parts[2]);
        this.versionString = version;
    }

    public lower(other: Version): boolean {
        if (other.major > this.major) {
            return true;
        }
        
        if (other.major < this.major) {
            return false;
        }

        if (other.minor > this.minor) {
            return true;
        }

        if (other.minor < this.minor) {
            return false;
        }

        if (other.patch > this.patch) {
            return true;
        }

        if (other.patch < this.patch) {
            return false;
        }

        return false;
    }
}

import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { User } from 'src/models/user.model';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { Requestor } from '../users/requestor.decorator';
import { MediaService } from './media.service';

const allowedFileTypes = ['.png', '.jpg', '.gif', '.jpeg', '.mp4', '.mov', '.avi', '.webm'];

@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
@Controller('media')
export class MediaController {

    constructor(
        private mediaService: MediaService
    ) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', { fileFilter: (req: Request, file, callback) => {
        const ext = path.extname(file.originalname);

        if (!allowedFileTypes.includes(ext)) {
            return callback(new Error('Media type not allowed. Try one of' + allowedFileTypes.join(', ')), false);
        }

        callback(null, true);
    }}))
    async upload(@Requestor() user: User, @UploadedFile() file: Express.Multer.File) {
        return this.mediaService.create(user.companyId, user.id, file.filename);
    }

    @Get(':id')
    async getByPath(@Param('id') id: string, @Res() res: Response) {
        const internalId = await this.mediaService.get(id);
        return res.sendFile(internalId, { root: path.resolve(__dirname, '../../../media') });
    }
}

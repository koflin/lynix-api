import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { User } from 'src/models/user.model';
import { v4 as uuidv4 } from 'uuid';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { Requestor } from '../users/requestor.decorator';
import { MediaService } from './media.service';

const allowedFileTypes = ['.png', '.jpg', '.gif', '.jpeg', '.mp4', '.ogg', '.webm'];

@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
@Controller('media')
export class MediaController {

    constructor(
        private mediaService: MediaService
    ) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', { 
        fileFilter: (req: Request, file, callback) => {
            const ext = path.extname(file.originalname);

            if (!allowedFileTypes.includes(ext)) {
                return callback(new Error('Media type "' + ext + '" not allowed. Try one of' + allowedFileTypes.join(', ')), false);
            }

            callback(null, true);
        },
        storage: diskStorage({
            filename: (req, file, cb) => {
                const id = uuidv4();
                return cb(null, id + path.extname(file.originalname));
            },
            destination: './media'
        })
    }))
    async upload(@Requestor() user: User, @UploadedFile() file: Express.Multer.File) {
        return this.mediaService.create(user.companyId, user.id, file.filename);
    }

    @Get(':id/:filename')
    async getByPath(@Param() params, @Res() res: Response) {
        const fileName = await this.mediaService.get(params['id']);

        if (fileName != params['filename']) {
            throw new NotFoundException();
        }

        return res.sendFile(fileName, { root: path.resolve(__dirname, '../../../media') });
    }
}

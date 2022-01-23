import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { User } from 'src/models/user.model';

import { Account } from '../auth/account.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { MediaService } from './media.service';

const allowedFileTypes = ['.png', '.jpg', '.gif', '.jpeg', '.mp4', '.ogg', '.webm'];
const env = process.env;

@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('media')
export class MediaController {

    constructor(
        private mediaService: MediaService,
        private config: ConfigService
    ) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', { 
        fileFilter: (req: Request, file, callback) => {
            const ext = path.extname(file.originalname).toLowerCase();

            if (!allowedFileTypes.includes(ext)) {
                return callback(new BadRequestException(`Media type '${ext}' not allowed. Try one of ${allowedFileTypes.join(', ')}`), false);
            }

            callback(null, true);
        }
    }))
    async upload(@Account() user: User, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new InternalServerErrorException('Storing file failed');
        }

        return this.mediaService.create(user.companyId, user.id, file.filename);
    }

    @Get(':id/:filename')
    async getByPath(@Param() params, @Res() res: Response) {
        const fileName = await this.mediaService.get(params['id']);

        if (fileName != params['filename']) {
            throw new NotFoundException('File does not exist');
        }

        return res.sendFile(fileName, { root: path.resolve(__dirname, '../../../' + this.config.get('media.path')) });
    }
}

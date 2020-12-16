import { ProductTemplate } from './../../../models/productTemplate.model';
import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductTemplateDoc } from 'src/schemas/productTemplate.schema';
import { Model } from 'mongoose';

@Controller('templates/product')
export class ProductTemplatesController {
}

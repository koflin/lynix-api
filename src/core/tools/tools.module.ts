import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MetadataModule } from '../metadata/metadata.module';
import { ToolDoc, ToolSchema } from './../../schemas/tool.schema';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ToolDoc.name, schema: ToolSchema, collection: 'tools'
    }]),
    MetadataModule
  ],
  controllers: [ToolsController],
  providers: [ToolsService]
})
export class ToolsModule {}

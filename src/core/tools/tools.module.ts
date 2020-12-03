import { ToolsController } from './tools.controller';
import { ToolDoc, ToolSchema } from './../../schemas/tool.schema';
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolsService } from './tools.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: ToolDoc.name, schema: ToolSchema, collection: 'tools'
    }]),
  ],
  controllers: [ToolsController],
  providers: [ToolsService]
})
export class ToolsModule {}

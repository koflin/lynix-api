import { Module } from '@nestjs/common';
import { ProcessTemplatesService } from './process-templates.service';
import { ProcessTemplatesController } from './process-templates.controller';

@Module({
  providers: [ProcessTemplatesService],
  controllers: [ProcessTemplatesController]
})
export class ProcessTemplatesModule {}

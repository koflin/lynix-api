import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDoc, RoleSchema } from 'src/schemas/role.schema';

import { MetadataModule } from '../metadata/metadata.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: RoleDoc.name, schema: RoleSchema, collection: 'roles'
    }]),
    MetadataModule
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDoc, RoleSchema } from 'src/schemas/role.schema';

import { MetadataModule } from '../metadata/metadata.module';
import { RolesController } from './roles.controller';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: RoleDoc.name, schema: RoleSchema, collection: 'roles'
    }]),
    MetadataModule
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesResolver],
  exports: [RolesService]
})
export class RolesModule {}

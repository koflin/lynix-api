import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminDoc, AdminSchema } from 'src/schemas/admin.schema';

import { AdminService } from './admin.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: AdminDoc.name, schema: AdminSchema, collection: 'admins',
    }]),
  ],
  providers: [AdminService],
})
export class AdminModule {}

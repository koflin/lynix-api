import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminDoc, AdminSchema } from 'src/schemas/admin.schema';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { RolesModule } from '../roles/roles.module';
import { AccountService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDoc.name, schema: UserSchema, collection: 'users' },
      { name: AdminDoc.name, schema: AdminSchema, collection: 'admins' }
    ]),
    RolesModule
  ],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {
  
}

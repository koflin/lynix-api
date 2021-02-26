import { RolesModule } from './../roles/roles.module';
import { Module, HttpModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: UserDoc.name, schema: UserSchema, collection: 'users',
    }]),
    RolesModule
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

import { Module, HttpModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: UserDoc.name, schema: UserSchema, collection: 'users'
    }]),
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

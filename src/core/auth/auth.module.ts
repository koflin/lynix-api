import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AdminDoc, AdminSchema } from 'src/schemas/admin.schema';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { AccountModule } from '../account/account.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret')
      })
    }),
    MongooseModule.forFeature([
      { name: UserDoc.name, schema: UserSchema, collection: 'users' },
      { name: AdminDoc.name, schema: AdminSchema, collection: 'admins' }
    ]),
    AccountModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [JwtModule, UsersModule, AuthGuard]
})
export class AuthModule {
}

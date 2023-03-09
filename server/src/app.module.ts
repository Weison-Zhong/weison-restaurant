import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import configuration from './config/default.config';
import { UserModule } from './modules/user/user.module';
import { LoginModule } from './modules/login/login.module';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SharedModule,
    UserModule,
    LoginModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

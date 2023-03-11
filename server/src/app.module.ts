import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import configuration from './config/default.config';
import { UserModule } from './modules/user/user.module';
import { LoginModule } from './modules/login/login.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogModule } from './modules/monitor/log/log.module';
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
    LogModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

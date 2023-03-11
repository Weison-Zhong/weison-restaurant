import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { jwtConstants } from '../auth/auth.constants';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { MenuModule } from '../menu/menu.module';
import { LogModule } from '../monitor/log/log.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '168h' },
    }),
    AuthModule,
    UserModule,
    MenuModule,
    LogModule
  ],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule { }

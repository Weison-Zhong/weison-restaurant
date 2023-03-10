import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RoleModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 如果别的地方如auth.service.ts有注入，则这里必须要导出否则会报错
})
export class UserModule { }

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReqAddUserDto } from './dto/req-user.dto';
import { UserService } from './user.service';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async addEventListener(@Body() reqAddUserDto: ReqAddUserDto) {
    await this.userService.addUser(reqAddUserDto)
  }
}

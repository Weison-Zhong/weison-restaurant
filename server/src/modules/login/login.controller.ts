import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginService } from './login.service';
import { Request } from 'express';
import { ReqLoginDto } from './dto/req-login.dto';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { UserEnum, User } from 'src/common/decorators/user.decorator';
import { DataObj } from 'src/common/class/data-obj.class';

@ApiTags('登录')
@ApiBearerAuth()
@Controller('')
export class LoginController {
  constructor(private readonly loginService: LoginService) {

  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() reqLoginDto: ReqLoginDto,
    @Req() req: Request,
  ) {

    const token = await this.loginService.login(req);
    return DataObj.create(token);
  }

  /* 获取用户信息 */
  @Get('getInfo')
  async getInfo(@User(UserEnum.userId) userId: number) {
    return await this.loginService.getUserInfo(userId);
  }
}

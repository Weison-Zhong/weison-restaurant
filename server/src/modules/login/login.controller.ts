import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginService } from './login.service';
import { Request } from 'express';
import { ReqLoginDto } from './dto/req-login.dto';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';

@ApiTags('登录')
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
    return await this.loginService.login(req);
  }
}

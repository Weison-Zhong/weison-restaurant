import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/common/exceptions/api.exception';
import { ReqAddUserDto, ReqResetPwdDto, ReqUpdateUserDto, ReqUserListDto } from './dto/req-user.dto';
import { UserService } from './user.service';
import { RepeatSubmit } from 'src/common/decorators/repeat-submit.decorator';
import { User } from './entities/user.entity';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { DataObj } from 'src/common/class/data-obj.class';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @RepeatSubmit()
  @Post()
  async addEventListener(@Body() reqAddUserDto: ReqAddUserDto) {
    const user = await this.userService.findOneByUsername(
      reqAddUserDto.username,
    );
    if (user) throw new ApiException('该用户名已存在，请更换');
    await this.userService.addUser(reqAddUserDto)
  }

  @RepeatSubmit()
  @Delete(':userIds')
  async delete(
    @Param('userIds') userIds: string,
  ) {
    const userIdList = userIds.split(',')
    await this.userService.delete(userIdList)
  }

  @RepeatSubmit()
  @Put()
  async update(
    @Body() reqUpdateUserDto: ReqUpdateUserDto
  ) {
    const user = await this.userService.findOneByUsername(reqUpdateUserDto.username);
    if (user) {
      await this.userService.updateUser(reqUpdateUserDto);
    } else {
      throw new ApiException('该用户不存在');
    }
  }
  /* 分页查询用户列表 */
  @Get('list')
  async list(
    @Query(PaginationPipe) reqUserListDto: ReqUserListDto,
  ) {
    return this.userService.list(reqUserListDto);
  }

  /* 通过id查询用户信息 */
  @Get(':userId')
  async one(@Param('userId') userId: number) {
    const user = (await this.userService.userAllInfo(userId));
    return DataObj.create(user);
  }

  //重置密码
  @RepeatSubmit()
  @Put('resetPwd')
  async resetPwd(
    @Body() reqResetPwdDto: ReqResetPwdDto,
  ) {
    const { userId, password } = reqResetPwdDto
    await this.userService.resetPwd(
      userId,
      password,
    );
  }
}

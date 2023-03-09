import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import {
  ERedisKey
} from 'src/common/contants/redis.contant';
import { ApiException } from 'src/common/exceptions/api.exception';
import { SharedService } from 'src/shared/shared.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly sharedService: SharedService,
    private readonly userService: UserService,
  ) { }

  /* 判断用户账号密码是否正确 */
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new ApiException('用户名或密码错误');
    }
    const comparePassword = this.sharedService.md5(password + user.salt);
    if (comparePassword !== user.password) {
      throw new ApiException('用户名或密码错误');
    }
    return user;
  }

  /* 判断token 是否过期 或者被重置 */
  async validateToken(userId: number, pv: number, restoken: string) {
    const token = await this.redis.get(`${ERedisKey.USER_TOKEN}:${userId}`);
    if (restoken !== token) {
      throw new ApiException('登录状态已过期', 401);
    }
    const passwordVersion = parseInt(
      await this.redis.get(`${ERedisKey.PASSWORD_VERSION}:${userId}`),
    );
    if (pv !== passwordVersion) throw new ApiException('用户信息已被修改', 401);
  }
}

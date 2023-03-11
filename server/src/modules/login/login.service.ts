import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';
import { SUPER_ADMIN_KEY } from 'src/common/contants';
import { ERedisKey } from 'src/common/contants/enum';
import { ApiException } from 'src/common/exceptions/api.exception';
import { MenuService } from '../menu/menu.service';
import { LogService } from '../monitor/log/log.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Payload } from './login.interface';
@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly menuService: MenuService,
    private readonly logService: LogService,
    @InjectRedis() private readonly redis: Redis,
  ) { }
  async login(request: Request) {
    const { user } = request as any;
    const payload: Payload = { userId: user.userId, pv: 1 };
    let jwtSign = this.jwtService.sign(payload);
    await this.redis.set(`${ERedisKey.PASSWORD_VERSION}:${user.userId}`, 1);
    //存储token, 防止重复登录问题，设置token过期时间(1天后 token 自动过期)，以及主动注销token。
    await this.redis.set(
      `${ERedisKey.USER_TOKEN}:${user.userId}`,
      jwtSign,
      'EX',
      60 * 60 * 24,
    );
    this.logService.addLoginLog(
      request,
      '登录成功',
      `${ERedisKey.USER_TOKEN}:${user.userId}`,
    );
    return { token: jwtSign };
  }

  /* 获取用户信息 */
  async getUserInfo(userId: number) {
    const user: User = await this.userService.userAllInfo(userId);
    if (!user) throw new ApiException('用户信息已被修改', 401);
    const { roles: userRoles } = user
    const roleKeyArr: string[] = userRoles.map((role) => role.roleKey);
    let permissions = [];
    if (!roleKeyArr.length) {
      permissions = [];
    } else {
      if (roleKeyArr.find((roleKey) => roleKey === SUPER_ADMIN_KEY)) {
        permissions = ['*:*:*'];
      } else {
        const roleIdArr = userRoles.map((role) => role.roleId);
        permissions = await this.menuService.getAllPermissionsByRoles(
          roleIdArr,
        );
      }
    }
    /* 将用户信息、权限数组、角色数组 存放进入缓存 */
    const promiseArr = [
      this.redis.set(`${ERedisKey.USER_USERNAME}:${userId}`, user.username),
      this.redis.set(`${ERedisKey.USER_NICK_NAME}:${userId}`, user.nickName),
      this.redis.set(
        `${ERedisKey.USER_PERMISSION}:${userId}`,
        JSON.stringify(permissions),
      ),
      this.redis.set(
        `${ERedisKey.USER_ROLE_KEYS}:${userId}`,
        JSON.stringify(roleKeyArr),
      ),
      this.redis.set(
        `${ERedisKey.USER_ROLES}:${userId}`,
        JSON.stringify(user.roles),
      ),
    ];
    await Promise.all(promiseArr);
    return {
      permissions,
      userInfo: user,
    };
  }
}

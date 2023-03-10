import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';
import { ERedisKey } from 'src/common/contants/enum';
import { Payload } from './login.interface';
@Injectable()
export class LoginService {
    constructor(
        private readonly jwtService: JwtService,
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
        return { token: jwtSign };
    }
}

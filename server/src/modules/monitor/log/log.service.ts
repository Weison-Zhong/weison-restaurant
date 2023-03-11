import { Injectable } from '@nestjs/common';
import { LoginLog } from './entities/login_log.entity';
import * as uaParser from 'ua-parser-js';
import * as moment from 'moment';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { User } from 'src/modules/user/entities/user.entity';
import { SharedService } from 'src/shared/shared.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ERedisKey, EStatusCode } from 'src/common/contants/enum';
import { OperationLog } from './entities/operation_log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LoginLog) private readonly loginLogRepository: Repository<LoginLog>,
    @InjectRepository(OperationLog) private readonly operationLogRepository: Repository<OperationLog>,
    @InjectRedis() private readonly redis: Redis,
    private readonly sharedService: SharedService,) { }

  // 新增操作日志
  async addOperLog(operLog: OperationLog) {
    return await this.operationLogRepository.save(operLog);
  }

  /* 新增登录日志 */
  async addLoginLog(request: Request, msg: string, token?: string) {
    const loginLog = new LoginLog();
    const { username } = request.body;
    const { browser, os } = uaParser(request.headers['user-agent']);
    loginLog.username = username;
    loginLog.ip = this.sharedService.getReqIP(request);
    loginLog.loginLocation = await this.sharedService.getLocation(
      loginLog.ip,
    );
    loginLog.status = token ? EStatusCode.NORMAL : EStatusCode.DISABLE;
    loginLog.msg = msg;
    loginLog.loginTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    loginLog.browser = browser.name + browser.version.split('.')[0];
    loginLog.os = os.name + os.version;
    if (token) {
      // 如果登录成功，就记录这个登录信息，方便在线用户查询
      const user: User = (request as any).user;
      const data = { deptName: '', tokenId: token };
      const loginUser = Object.assign(loginLog, data);
      await this.redis.set(
        `${ERedisKey.USER_ONLINE}:${user.userId}`,
        JSON.stringify(loginUser),
        'EX',
        60 * 60 * 24,
      );
    }
    return await this.loginLogRepository.save(loginLog);
  }
}

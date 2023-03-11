import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OperationLog } from 'src/modules/monitor/log/entities/operation_log.entity';
import { LogService } from 'src/modules/monitor/log/log.service';
import { SharedService } from 'src/shared/shared.service';
import { AjaxResult } from '../class/ajax-result.class';
import { LOG_KEY_METADATA } from '../contants/decorator.contant';
import { ERedisKey, EStatusCode } from '../contants/enum';
import { LogOption } from '../decorators/log.decorator';

import { AllExceptionsFilter } from '../filters/all-exception.filter';

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @InjectRedis() private readonly redis: Redis,
    private readonly logService: LogService,
    private readonly sharedService: SharedService,
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: (data) => {
          return this.log(context, data);
        },
        error: (e) => {
          const allExceptionsFilter = new AllExceptionsFilter();
          const { result } = allExceptionsFilter.errorResult(e);
          return this.log(context, result);
        },
      }),
    );
  }

  /* 记录操作日志 */
  async log(context: ExecutionContext, data: AjaxResult) {
    const logOption = this.reflector.get<LogOption>(
      LOG_KEY_METADATA,
      context.getHandler(),
    );
    if (!logOption) return;
    const request = context.switchToHttp().getRequest();
    const method = request.method.toUpperCase();
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const operLog = new OperationLog();
    /* 模块标题 */
    operLog.title = logOption.title;
    /* 业务类型 */
    operLog.businessType = logOption.businessType;
    /* 请求方式 */
    operLog.requestMethod = method;
    /* 方法名称 */
    operLog.method = `${className}.${handlerName}()`;
    if (request.user) {
      /* 操作人员 */
      const userId = request.user.userId;
      const userName = await this.redis.get(`${ERedisKey.USER_USERNAME}:${userId}`);
      operLog.operName = userName;
      /* 请求url */
      operLog.operUrl = request.url;
      /* 请求ip */
      operLog.operIp = this.sharedService.getReqIP(request);
      /* 请求地址 */
      operLog.operLocation = await this.sharedService.getLocation(
        operLog.operIp,
      );
      /* 请求参数 */
      if (logOption.isSaveRequestData) {
        const data = {
          params: request.params,
          query: request.query,
          body: request.body,
        };
        operLog.operParam = JSON.stringify(data);
      }
      console.log({data});
      /* 成功的请求 */
      if ((data && data.code === 200) || data instanceof StreamableFile) {
        //如果是流，都算成功
        operLog.status = EStatusCode.NORMAL;
      } else {
        //失败的请求
        operLog.status = EStatusCode.DISABLE;
        operLog.errorMsg = data && data.msg;
      }
      /* 记录返回值 */
      if (logOption.isSaveResponseData) {
        operLog.jsonResult = JSON.stringify(data);
      }
      // 请求时间
      operLog.operTime = moment().format('YYYY-MM-DDTHH:mm:ss');
      return this.logService.addOperLog(operLog);
    }
  }
}
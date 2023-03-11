import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { RepeatSubmitGuard } from 'src/common/guards/repeat-submit.guard';
import { ReponseTransformInterceptor } from 'src/common/interceptors/reponse-transform.interceptor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SharedService } from './shared.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionVerifyGuard } from 'src/common/guards/permission-verify.guard';
import { OperationLogInterceptor } from 'src/common/interceptors/operation-log.interceptor';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LogModule } from 'src/modules/monitor/log/log.module';
@Global()
@Module({
  imports: [
    /* 连接mysql数据库 */
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        type: configService.get<any>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadModels: configService.get<boolean>('database.autoLoadModels'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),

    /* 连接redis */
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<any>('redis'),
      inject: [ConfigService],
    }),
    /* 导入速率限制模块   ttl:单位秒钟， 表示ttl秒内最多只能请求 limit 次， 避免暴力攻击。*/
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),

    /* 导入系统日志模块 */
    LogModule,
  ],
  providers: [
    SharedService,
    //全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    //阻止连续提交守卫
    {
      provide: APP_GUARD,
      useClass: RepeatSubmitGuard,
    },
    /* 操作日志拦截器 。 注：拦截器中的 handle 从下往上执行（ReponseTransformInterceptor ----> OperationLogInterceptor），返回值值依次传递 */
    {
      provide: APP_INTERCEPTOR,
      useClass: OperationLogInterceptor,
    },
    /* 全局返回值转化拦截器 */
    {
      provide: APP_INTERCEPTOR,
      useClass: ReponseTransformInterceptor,
    },
    //速率限制守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    //jwt守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 权限守卫
    {
      provide: APP_GUARD,
      useClass: PermissionVerifyGuard,
    },
  ],
  exports: [SharedService],
})
export class SharedModule { }
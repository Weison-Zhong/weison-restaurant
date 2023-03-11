import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginLog } from './entities/login_log.entity';
import { OperationLog } from './entities/operation_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginLog, OperationLog])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService]
})
export class LogModule { }

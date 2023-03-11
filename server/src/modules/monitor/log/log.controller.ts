import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';

@ApiTags('日志管理')
@ApiBearerAuth()
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}
}

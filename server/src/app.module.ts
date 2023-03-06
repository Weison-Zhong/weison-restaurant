import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import configuration from './config/default.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

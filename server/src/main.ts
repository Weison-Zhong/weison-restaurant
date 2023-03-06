import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { setupSwagger } from './setup-swagger';
import config from './config';
const { APP_PORT } = config;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: false, //取消https强制转换
    }),
  );

  setupSwagger(app);

  await app.listen(APP_PORT);

  console.log(`http://127.0.0.1:${APP_PORT}/swagger-doc`);
}

bootstrap();

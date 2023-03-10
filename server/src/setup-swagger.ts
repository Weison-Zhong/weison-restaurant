import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('餐饮点餐系统')
    .setDescription('Api文档V1')
    .setTermsOfService('https://docs.nestjs.cn/8/introduction')
    .setLicense('MIT', '')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '粘贴login返回的token值',
        in: 'header',
      },
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger-doc', app, document);
}

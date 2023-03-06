
import { Logger } from '@nestjs/common';
import config from '.';

const { JWT_SECRET, MYSQL_HOST, MYSQL_PORT, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE, REDIS_PASSWORD, REDIS_HOST, UPLOAD_PATH } = config

export default () => {
    let envConfig: any = {};
    try {
        envConfig = {
            jwt: {
                secret: JWT_SECRET || '123456',
            },
            database: {
                type: 'mysql',
                host: MYSQL_HOST || 'localhost',
                port: MYSQL_PORT || 3306,
                username: MYSQL_USERNAME || 'root',
                password: MYSQL_PASSWORD || '123456',
                database: MYSQL_DATABASE || 'demo',
                autoLoadModels: true,
                synchronize: false,
                logging: true,
            },
            // redis 配置
            redis: {
                config: {
                    url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:6379/0`,
                },
            },
            uploadPath: UPLOAD_PATH ?? '/upload'
        }
    } catch (e) {
        const logger = new Logger('ConfigModule');
        logger.error(e);
    }

    // 返回环境配置
    return envConfig;
};
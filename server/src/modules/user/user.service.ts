import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { reverse } from 'dns';
import Redis from 'ioredis';
import moment from 'moment';
import { EDeleteFlag, ERedisKey } from '../../common/contants/enum';
import { SharedService } from 'src/shared/shared.service';
import { Between, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { ReqAddUserDto, ReqUpdateUserDto, ReqUserListDto } from './dto/req-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly sharedService: SharedService, @InjectRedis() private readonly redis: Redis,) { }
  async addUser(reqAddUserDto: ReqAddUserDto) {
    if (reqAddUserDto.password) {
      reqAddUserDto.salt = this.sharedService.generateUUID();
      reqAddUserDto.password = this.sharedService.md5(
        reqAddUserDto.password + reqAddUserDto.salt,
      );
    }
    await this.userRepository.save(reqAddUserDto);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({
      select: ['userId', 'username', 'password', 'salt', 'status', 'delFlag'],
      where: {
        username,
        delFlag: '1'
      }
    })
  }

  async delete(userIdList: string[]) {
    return await this.userRepository.createQueryBuilder()
      .update()
      .set({
        delFlag: '0'
      })
      .where({
        userId: In(userIdList)
      })
      .execute()
  }

  async updateUser(reqUpdateUserDto: ReqUpdateUserDto) {
    await this.userRepository.save(reqUpdateUserDto);
  }

  //通过id 查找用户的所有信息
  async userAllInfo(userId: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .getOne();
  }

  /* 分页查询用户列表 */
  async list(
    reqUserListDto: ReqUserListDto
  ) {
    const where: FindOptionsWhere<User> = { delFlag: EDeleteFlag.NORMAL };
    if (reqUserListDto.username) {
      where.username = Like(`%${reqUserListDto.username}%`);
    }
    if (reqUserListDto.tel) {
      where.tel = Like(`%${reqUserListDto.tel}%`);
    }
    if (reqUserListDto.status) {
      where.status = reqUserListDto.status;
    }
    if (reqUserListDto.params) {
      where.createTime = Between(
        reqUserListDto.params.beginTime,
        moment(reqUserListDto.params.endTime).add(1, 'day').format(),
      );
    }
    const queryBuilde = this.userRepository.createQueryBuilder('user');
    const result = await queryBuilde
      .andWhere(where)
      .orderBy('user.createTime', 'ASC')
      .skip(reqUserListDto.skip)
      .take(reqUserListDto.take)
      .getManyAndCount();
    return {
      rows: result[0],
      total: result[1],
    };
  }

  /* id查询用户 */
  async findById(userId: number) {
    return await this.userRepository.findOneBy({ userId });
  }

  /* 更改密码 */
  async resetPwd(userId: number, password: string) {
    const user = await this.findById(userId);
    user.salt = this.sharedService.generateUUID();
    user.password = this.sharedService.md5(password + user.salt);
    await this.userRepository.save(user);
    if (await this.redis.get(`${ERedisKey.PASSWORD_VERSION}:${userId}`)) {
      await this.redis.set(`${ERedisKey.PASSWORD_VERSION}:${userId}`, 2); //调整密码版本，强制用户重新登录
    }
  }
}

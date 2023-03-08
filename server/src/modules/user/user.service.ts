import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { reverse } from 'dns';
import moment from 'moment';
import { Between, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { ReqAddUserDto, ReqUpdateUserDto, ReqUserListDto } from './dto/req-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }
  async addUser(reqAddUserDto: ReqAddUserDto) {
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
    console.log({ reqUserListDto });
    const where: FindOptionsWhere<User> = { delFlag: '1' };
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
    console.log({ result });
    return {
      rows: result[0],
      total: result[1],
    };
  }
}

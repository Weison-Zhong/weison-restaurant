import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReqAddUserDto } from './dto/req-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }
    async addUser(reqAddUserDto: ReqAddUserDto) {
        await this.userRepository.save(reqAddUserDto);
    }

}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { EDeleteFlag } from 'src/common/contants/enum';
import { Between, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { MenuService } from '../menu/menu.service';
import { ReqAddRoleDto, ReqRoleListDto, ReqUpdateRolePermissionDto } from './dto/req-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,
  ) { }

  async addOrUpdate(reqAddRoleDto: ReqAddRoleDto) {
    await this.roleRepository.save(reqAddRoleDto)
  }

  async delete(roleIdList: string[]) {
    return await this.roleRepository
      .createQueryBuilder()
      .update()
      .set({ delFlag: EDeleteFlag.DELETED, })
      .where('roleId in (:...roleIdList) ', { roleIdList })
      .execute();
  }
  /* 通过id查询 */
  async findById(roleId: number) {
    // return await this.roleRepository
    //   .createQueryBuilder('role')
    //   .leftJoinAndSelect('role.menus', 'menu')
    //   .where('role.roleId = :roleId', { roleId })
    //   .getOne();

    return this.roleRepository.findOneBy({ roleId });
  }


  /* 分页查询 */
  async list(reqRoleListDto: ReqRoleListDto) {
    const where: FindOptionsWhere<Role> = {
      delFlag: EDeleteFlag.NORMAL,
    };
    if (reqRoleListDto.roleName) {
      where.roleName = Like(`%${reqRoleListDto.roleName}%`);
    }
    if (reqRoleListDto.roleKey) {
      where.roleKey = Like(`%${reqRoleListDto.roleKey}%`);
    }
    if (reqRoleListDto.status) {
      where.status = reqRoleListDto.status;
    }
    if (reqRoleListDto.params) {
      where.createTime = Between(
        reqRoleListDto.params.beginTime,
        moment(reqRoleListDto.params.endTime).add(1, 'day').format(),
      );
    }
    const result = await this.roleRepository.findAndCount({
      select: [
        'roleId',
        'roleName',
        'roleKey',
        'createTime',
        'status',
        'roleSort',
        'createBy',
        'remark',
      ],
      where,
      order: {
        roleSort: 1,
        createTime: 1,
      },
      skip: reqRoleListDto.skip,
      take: reqRoleListDto.take,
    });
    return {
      rows: result[0],
      total: result[1],
    };
  }

  // 分配权限
  async updatePermission(reqUpdateRolePermissionDto: ReqUpdateRolePermissionDto) {
    const menuList = await this.menuService.listByIdArr(reqUpdateRolePermissionDto.menuIds);
    reqUpdateRolePermissionDto.menus = menuList;
    await this.roleRepository.save(reqUpdateRolePermissionDto)
  }

  /* 通过id数组查询 */
  listByIdArr(idArr: number[]) {
    return this.roleRepository.find({
      where: {
        delFlag: EDeleteFlag.NORMAL,
        roleId: In(idArr),
      },
    });
  }
}

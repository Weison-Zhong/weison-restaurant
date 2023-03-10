import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SharedService } from 'src/shared/shared.service';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ReqAddMenuDto, ReqMenuListDto } from './dto/req-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>, private readonly sharedService: SharedService,) { }

  /* 新增或编辑菜单 */
  async addOrUpdate(reqAddMenuDto: ReqAddMenuDto) {
    if (reqAddMenuDto.parentId) {
      const parentMenu = await this.findById(reqAddMenuDto.parentId);
      reqAddMenuDto.parent = parentMenu;
    }
    await this.menuRepository.save(reqAddMenuDto);
  }

  /* 通过id查询 */
  async findById(menuId: number) {
    return this.menuRepository.findOneBy({ menuId });
  }

  /* 通过 parentId 查询其所有孩子 */
  async findChildsByParentId(parentId: number): Promise<Menu[]> {
    return this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.parentmenuId = :parentId', { parentId })
      .getMany();
  }

  /* 删除菜单 */
  async delete(menuId: number) {
    const menu = await this.menuRepository.findOneBy({ menuId });
    if (!menu) return;
    // menu.roles = [];
    // await this.menuRepository.save(menu);
    return this.menuRepository.delete(menuId);
  }

  /* 通过id查询，返回原始数据 */
  async findRawById(menuId: number | string) {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .select('menu.menuId', 'menuId')
      .addSelect('menu.createTime', 'createTime')
      .addSelect('menu.menuName', 'menuName')
      .addSelect('menu.order', 'order')
      .addSelect('menu.status', 'status')
      .addSelect('menu.permission', 'permission')
      .addSelect('ifnull(menu.parentMenuId,0)', 'parentId')
      .andWhere('menu.menuId = :menuId', { menuId })
      .getRawOne();
  }


  /* 查询菜单列表 */
  async list(reqMenuListDto: ReqMenuListDto) {
    const where: FindOptionsWhere<Menu> = {};
    if (reqMenuListDto.menuName) {
      where.menuName = Like(`%${reqMenuListDto.menuName}%`);
    }
    if (reqMenuListDto.status) {
      where.status = reqMenuListDto.status;
    }
    return await this.menuRepository
      .createQueryBuilder('menu')
      .select('menu.menuId', 'menuId')
      .addSelect('menu.createTime', 'createTime')
      .addSelect('menu.menuName', 'menuName')
      .addSelect('menu.order', 'order')
      .addSelect('menu.status', 'status')
      .addSelect('menu.permission', 'permission')
      .addSelect('menu.parentMenuId', 'parentId')
      .where(where)
      .orderBy('menu.order', 'ASC')
      .addOrderBy('menu.createTime', 'ASC')
      .getRawMany();
  }
}

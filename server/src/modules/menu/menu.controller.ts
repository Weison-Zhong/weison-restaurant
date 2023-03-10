import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DataObj } from 'src/common/class/data-obj.class';
import { RepeatSubmit } from 'src/common/decorators/repeat-submit.decorator';
import { ApiException } from 'src/common/exceptions/api.exception';
import { User } from '../user/entities/user.entity';
import { ReqAddMenuDto, ReqMenuListDto, ReqUpdateMenu } from './dto/req-menu.dto';
import { MenuService } from './menu.service';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }
  /* 新增菜单 */
  @RepeatSubmit()
  @Post()
  async add(
    @Body() reqAddMenuDto: ReqAddMenuDto,
  ) {
    await this.menuService.addOrUpdate(reqAddMenuDto);
  }


  /* 删除菜单 */
  @Delete(':menuId')
  async delete(@Param('menuId') menuId: number) {
    const childs = await this.menuService.findChildsByParentId(menuId);
    if (childs && childs.length)
      throw new ApiException('该菜单下还存在其他菜单，无法删除');
    await this.menuService.delete(menuId);
  }

  /* 修改菜单 */
  @RepeatSubmit()
  @Put()
  async update(
    @Body() reqUpdateMenu: ReqUpdateMenu
  ) {
    await this.menuService.addOrUpdate(reqUpdateMenu);
  }

  /* 菜单列表 */
  @Get()
  async list(@Query() reqMenuListDto: ReqMenuListDto) {
    const menutArr = await this.menuService.list(reqMenuListDto);
    return DataObj.create(menutArr);
  }

  /* 通过id查询列表 */
  @Get(':menuId')
  async one(@Param('menuId') menuId: number) {
    const menu = await this.menuService.findRawById(menuId);
    return DataObj.create(menu);
  }
}

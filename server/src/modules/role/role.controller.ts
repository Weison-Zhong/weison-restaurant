import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DataObj } from 'src/common/class/data-obj.class';
import { RepeatSubmit } from 'src/common/decorators/repeat-submit.decorator';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { ReqAddRoleDto, ReqRoleListDto, ReqUpdateRoleDto } from './dto/req-role.dto';
import { RoleService } from './role.service';

@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @RepeatSubmit()
  async add(
    @Body() reqAddRoleDto: ReqAddRoleDto,
  ) {
    await this.roleService.addOrUpdate(reqAddRoleDto);
  }

  @Delete(':roleIds')
  @RepeatSubmit()
  async delete(
    @Param('roleIds') roleIds: string
  ) {
    const roleIdList = roleIds.split(',')
    await this.roleService.delete(roleIdList)
  }

  /* 编辑角色 */
  @RepeatSubmit()
  @Put()
  async update(
    @Body() reqUpdateRoleDto: ReqUpdateRoleDto,
  ) {
    await this.roleService.addOrUpdate(reqUpdateRoleDto);
  }


  /* 分页查询角色列表 */
  @Get('list')
  async list(@Query(PaginationPipe) reqRoleListDto: ReqRoleListDto) {
    return this.roleService.list(reqRoleListDto);
  }

  /* 通过Id 查询角色 */
  @Get(':roleId')
  async one(@Param('roleId') roleId: number) {
    const role = await this.roleService.findById(roleId);
    return DataObj.create(role);
  }
}

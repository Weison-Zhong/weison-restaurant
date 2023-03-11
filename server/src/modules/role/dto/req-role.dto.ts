import { OmitType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ParamsDto } from "src/common/dto/params.dto";
import { Role } from "../entities/role.entity";


export class ReqAddRoleDto extends OmitType(Role, ['roleId'] as const) {
 
}

/* 编辑角色 */
export class ReqUpdateRoleDto extends ReqAddRoleDto {
    @Type()
    @IsNumber()
    roleId: number;
}

/* 分页查询 */
export class ReqRoleListDto extends PaginationDto {
    @IsOptional()
    @IsString()
    roleName?: string;

    @IsOptional()
    @IsString()
    roleKey?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsObject()
    params: ParamsDto;
}

export class ReqUpdateRolePermissionDto extends PickType(Role, ['menus','roleId'] as const) {

    /* 菜单id数组 */
    @IsArray()
    menuIds: number[];

}

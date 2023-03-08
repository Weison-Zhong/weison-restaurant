import { OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, IsObject } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ParamsDto } from "src/common/dto/params.dto";
import { User } from "../entities/user.entity";

export class ReqAddUserDto extends OmitType(User, ['userId'] as const) {

}

/* 编辑用户 */
export class ReqUpdateUserDto extends OmitType(User, ['password'] as const) {

}


/* 分页查询用户 */
export class ReqUserListDto extends PaginationDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    tel?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @Type()
    @IsNumber()
    deptId?: number;

    @IsOptional()
    @IsObject()
    params: ParamsDto;
}
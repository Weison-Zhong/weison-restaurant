import { ApiHideProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { EStatusCode } from "src/common/contants/enum";
import { BaseEntity } from "src/common/entities/base.entity";
import { Role } from "src/modules/role/entities/role.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";


@Entity()
@Tree('materialized-path')
export class Menu extends BaseEntity {
    /* 菜单ID */
    @PrimaryGeneratedColumn({
        comment: '菜单id',
        type: 'int',
    })
    @Type()
    @IsNumber()
    menuId: number;

    /* 菜单名称 */
    @Column({
        comment: '菜单名称',
        length: 50,
    })
    @IsString()
    menuName: string;

    /* 显示顺序 */
    @Column({
        comment: '显示顺序',
    })
    @IsNumber()
    order: number;


    /* 菜单状态（0正常 1停用） */
    @Column({
        comment: '菜单状态（1正常 0停用）',
        length: 1,
        type: 'char',
        default: EStatusCode.NORMAL,
    })
    @IsOptional()
    @IsString()
    status?: string;

    /* 权限标识 */
    @Column({
        comment: '权限标识',
        length: 100,
        default: null,
    })
    @IsOptional()
    @IsString()
    permission?: string;

    @ApiHideProperty()
    @TreeChildren()
    children: Menu[];

    @ApiHideProperty()
    @TreeParent()
    parent: Menu;

    @ApiHideProperty()
    @ManyToMany(() => Role, (role) => role.menus)
    roles: Role[];
}
import { ApiHideProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { Menu } from "src/modules/menu/entities/menu.entity";


@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn({
        comment: '角色',
        type: 'int'
    })
    @Type()
    @IsNumber()
    roleId: number;

    @Column({
        length: 30
    })
    @IsString()
    roleName: string;

    @Column({
        comment: '角色权限字符串',
        length: 100,
    })
    @IsString()
    roleKey: string;

    /* 显示顺序 */
    @Column({
        comment: '显示顺序',
    })
    @IsNumber()
    roleSort: number;


    @Column({
        comment: '角色状态（1正常 0停用）',
        length: 1,
        type: 'char',
        default: '1',
    })
    @IsString()
    status: string;

    @Column({
        comment: '删除标志（1正常 0删除）',
        length: 1,
        type: 'char',
        default: '1',
    })
    @ApiHideProperty()
    delFlag: string;

    @ApiHideProperty()
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];


    @ApiHideProperty()
    @ManyToMany(() => Menu, (menu) => menu.roles)
    @JoinTable()
    menus: Menu[];
}
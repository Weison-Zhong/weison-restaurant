import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiHideProperty } from "@nestjs/swagger";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({ comment: '用户id' })
    @Type()
    @IsNumber()
    userId: number;

    @Column({ comment: '用户账号', length: 30 })
    @IsString()
    username: string;

    /* 密码 */
    @Column({
        comment: '密码',
        length: 100,
        default: '',
        select: false,
    })
    @IsString()
    password: string;

    @ApiHideProperty()
    @Column({
        comment: '盐加密',
        length: 100,
        default: '',
        select: false,
    })
    salt: string;

    @Column({ comment: '昵称', length: 30 })
    @IsString()
    nickName: string;

    @Column({
        comment: '头像图片路径',
        length: 100,
        default: '',
    })
    @IsOptional()
    @IsString()
    avatar?: string;

    /* 用户邮箱 */
    @Column({
        comment: '用户邮箱',
        length: 50,
        default: null,
    })
    @IsOptional()
    @IsString()
    email?: string;

    /* 手机号码 */
    @Column({
        comment: '手机号码',
        length: 11,
        default: null,
    })
    @IsOptional()
    @IsString()
    tel?: string;

    @Column({
        comment: '地址',
        length: 1000,
        default: '',
    })
    @IsOptional()
    @IsString()
    address?: string;

    /* 帐号状态 */
    @Column({
        comment: '帐号状态（1正常 0停用）',
        type: 'char',
        length: 1,
        default: '1',
    })
    @IsString()
    @IsString()
    status: string;

    /* 最后登录IP */
    @Column({
        name: 'login_ip',
        comment: '最后登录IP',
        length: 128,
        default: '',
    })
    @IsOptional()
    @IsString()
    loginIp?: string;

    /* 最后登录时间 */
    @Column({
        name: 'login_date',
        comment: '最后登录时间',
        default: null,
    })
    @IsOptional()
    @IsString()
    loginDate?: Date;

    @ApiHideProperty()
    @Column({
        comment: '删除标志（1正常 0删除）',
        type: 'char',
        length: 1,
        default: '1',
    })
    delFlag: string;
}
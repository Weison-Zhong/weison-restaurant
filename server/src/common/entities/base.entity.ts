import { ApiHideProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsOptional, IsString } from 'class-validator';

export class BaseEntity {
    @CreateDateColumn({ comment: '创建时间' })
    @ApiHideProperty()
    createTime: Date | string;

    @UpdateDateColumn({ comment: '更新时间' })
    @ApiHideProperty()
    updateTime: Date | string;

    @Column({ comment: "创建人", length: 30, default: '' })
    @ApiHideProperty()
    createBy: string;

    @Column({ comment: '更新人', length: 30, default: '' })
    @ApiHideProperty()
    updateBy: string;

    @Column({ comment: "备注", default: "" })
    @IsOptional()
    @IsString()
    remark?: string;
}
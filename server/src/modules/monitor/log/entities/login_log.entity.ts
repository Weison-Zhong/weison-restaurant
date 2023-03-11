import { EStatusCode } from 'src/common/contants/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoginLog {
  /* 访问id */
  @PrimaryGeneratedColumn({
    comment: '访问ID',
  })
  logId: number;

  /* 用户账号 */
  @Column({
    comment: '用户账号(用户名)',
    length: 50,
    default: '',
  })
  username: string;

  /* 登录IP地址 */
  @Column({
    comment: '登录IP地址',
    length: 128,
    default: '',
  })
  ip: string;

  /* 登录地点 */
  @Column({
    comment: '登录地点',
    length: 255,
    default: '',
  })
  loginLocation: string;

  /* 浏览器类型 */
  @Column({
    comment: '浏览器类型',
    length: 50,
    default: '',
  })
  browser: string;

  /* 浏览器操作系统类型 */
  @Column({
    comment: '浏览器操作系统类型',
    length: 50,
    default: '',
  })
  os: string;

  @Column({
    name: 'status',
    comment: '登录状态 1成功 0失败',
    length: 1,
    type: 'char',
    default: EStatusCode.NORMAL,
  })
  status: string;

  /* 提示消息 */
  @Column({
    comment: '提示消息',
    length: 255,
    default: '',
  })
  msg: string;

  /* 访问时间 */
  @Column({
    comment: '访问时间',
    type: 'datetime',
  })
  loginTime: string;
}

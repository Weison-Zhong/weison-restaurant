import { EStatusCode } from 'src/common/contants/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'oper_log',
})
export class OperationLog {
  /* 日志主键 */
  @PrimaryGeneratedColumn({
    comment: '日志主键',
  })
  operationLogId: number;

  /* 模块标题 */
  @Column({
    comment: '模块标题',
    length: 50,
    default: '',
  })
  title: string;

  /* '业务类型 */
  @Column({
    comment: '业务类型',
    default: '0',
    type: 'char',
    length: 1,
  })
  businessType: string;

  /* 方法名称 */
  @Column({
    comment: '方法名称',
    length: 100,
    default: '',
  })
  method: string;

  /* 请求方式 */
  @Column({
    comment: '请求方式',
    length: 10,
    default: '',
  })
  requestMethod: string;

  /* 操作类别（0其它 1后台用户 2手机端用户） */
  @Column({
    comment: '操作类别（0其它 1后台用户 2手机端用户）',
    default: '0',
    type: 'char',
    length: 1,
  })
  operatorType: string;

  /* 操作人员 */
  @Column({
    comment: '操作人员',
    length: 50,
    default: '',
  })
  operName: string;

  /* 请求URL */
  @Column({
    comment: '请求URL',
    length: 255,
    default: '',
  })
  operUrl: string;

  /* 主机地址 */
  @Column({
    comment: '主机地址',
    length: 128,
    default: '',
  })
  operIp: string;

  /* 操作地点 */
  @Column({
    comment: '操作地点',
    length: 255,
    default: '',
  })
  operLocation: string;

  /* 请求参数 */
  @Column({
    comment: '请求参数',
    length: 2000,
    default: '',
  })
  operParam: string;

  /* 返回参数 */
  @Column({
    comment: '返回参数',
    length: 2000,
    default: '',
  })
  jsonResult: string;

  /* 操作状态（0正常 1异常） */
  @Column({
    comment: '操作状态（1正常 0异常）',
    default: EStatusCode.NORMAL,
    type: 'char',
    length: 1,
  })
  status: string;

  /* 错误信息 */
  @Column({
    comment: '错误信息',
    length: 2000,
    default: '',
  })
  errorMsg: string;

  /* 操作时间 */
  @Column({
    comment: '操作时间',
    type: 'datetime',
  })
  operTime: string;
}

import { IsString } from 'class-validator';

export class ReqLoginDto {
  /* 用户名 */
  @IsString()
  username: string;

  /* 密码 */
  @IsString()
  password: string;
}

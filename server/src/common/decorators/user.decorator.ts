import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export enum UserEnum {
  'userId' = 'userId',
  'username' = 'username',
  'nickName' = 'nickName',
}

// 设置在参数中 获取 哪些用户信息
export const User = createParamDecorator(
  (data: UserEnum, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const res = data ? user && user.userId : user;
    return res
  }
);

import { SetMetadata } from '@nestjs/common';
import { REOEATSUBMIT_METADATA } from '../contants/decorator.contant';

export class RepeatSubmitOption {
  interval?: number = 3; //默认3s
  message?: string = '请求过于频繁,请稍后重试';
}

export const RepeatSubmit = (option?: RepeatSubmitOption) => {
  const repeatSubmitOption = Object.assign(new RepeatSubmitOption(), option);
  return SetMetadata(REOEATSUBMIT_METADATA, repeatSubmitOption);
};

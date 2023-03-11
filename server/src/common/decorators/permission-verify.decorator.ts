import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY_METADATA } from '../contants/decorator.contant';
import { EPermissionVerifyLogical } from '../contants/enum';

export type PermissionObj = {
  permissionArr: string[];
  logical: EPermissionVerifyLogical;
};

export const PermissionVerify = (
  permissions: string | string[],
  logical: EPermissionVerifyLogical = EPermissionVerifyLogical.or,
) => {
  let permissionObj: PermissionObj = {
    permissionArr: [],
    logical,
  };
  if (typeof permissions === 'string') {
    permissionObj = {
      permissionArr: [permissions],
      logical,
    };
  } else if (permissions instanceof Array) {
    permissionObj = {
      permissionArr: permissions,
      logical,
    };
  }
  return SetMetadata(PERMISSION_KEY_METADATA, permissionObj);
};

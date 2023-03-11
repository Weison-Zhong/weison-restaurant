export enum EDeleteFlag {
    DELETED = "0",
    NORMAL = "1",
}

export enum EStatusCode {
    /* 帐号状态（1正常 0停用） */
    NORMAL = "1",
    DISABLE = "0"
}

export enum ERedisKey {
    /* 密码版本 */
    PASSWORD_VERSION = "password:version",
    /* JWT Token */
    USER_TOKEN = "user:token",
    /* 用户权限 */
    USER_PERMISSION = "user:permission",
    /* 用户名（账户） */
    USER_USERNAME = "user:userame",
    /* 用户昵称 */
    USER_NICK_NAME = "user:nickName",
    /* 用户角色Key标识 */
    USER_ROLE_KEYS = "user:roleKeys",
    /* 用户角色 */
    USER_ROLES = "user:roles",
    /* 在线用户 */
    USER_ONLINE = "user:online",
}

export enum EPermissionVerifyLogical {
    /* 具备任意一个 */
    or = 0,

    /* 同时具备所有 */
    and = 1,
}
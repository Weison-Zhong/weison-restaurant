export enum EDeleteFlag {
    DELETED = "0",
    NORMAL = "1",
}

export enum EStatusCode {
    // 帐号状态（1正常 0停用）
    NORMAL = "1",
    DISABLE = "0"
}

export enum ERedisKey {
    PASSWORD_VERSION = "password:version",
    USER_TOKEN = "user:token",
}
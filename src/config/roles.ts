export enum ROLE {
    admin = 'admin',
    user = 'user',
    guest = 'guest',
    manager = 'manager'
};

export enum PERMISSION {
    READ_ORDER = "read:order",
    WRITE_ORDER = "write:order",
    UPDATE_ORDER = "update:order",
    DELETE_ORDER = "delete:order",
    READ_USER = "read:user",
    WRITE_USER = "write:user",
    UPDATE_USER = "update:user",
    DELETE_USER = "delete:user",
    AUTH_LOGIN = "auth:login",
    AUTH_LOGOUT = "auth:logout"
};

type RolePermissions = {
    [key in ROLE]: PERMISSION[];
};

export const rolePermissions: RolePermissions = {
    [ROLE.admin]: [
        ...Object.values(PERMISSION)
    ],
    [ROLE.manager]: [
        PERMISSION.READ_ORDER,
        PERMISSION.WRITE_ORDER,
        PERMISSION.UPDATE_ORDER,
        PERMISSION.DELETE_ORDER,
        PERMISSION.READ_USER,
        PERMISSION.AUTH_LOGIN,
        PERMISSION.AUTH_LOGOUT
    ],
    [ROLE.user]: [
        PERMISSION.WRITE_ORDER,
        PERMISSION.AUTH_LOGIN,
        PERMISSION.AUTH_LOGOUT
    ],
    [ROLE.guest]: [
        PERMISSION.AUTH_LOGIN,
    ]
};

export const toRole = (role: string): ROLE  => {
    switch (role) {
        case ROLE.admin:
            return ROLE.admin;
        case ROLE.manager:
            return ROLE.manager;
        case ROLE.user:
            return ROLE.user;
        case ROLE.guest:
            return ROLE.guest;
        default:
            throw new Error(`Invalid role: ${role}`);
    }
}
import http from '@/utils/http.js'

//获取权限列表
export const getRightsList = (parmas) => {
    return http
        .get(`rights/${parmas}`)
}
//删除角色权限
export const getRolesRights = (id, parmas) => {
    return http
        .delete(`roles/${id}/rights/${parmas}`)
}
//角色授权
export const getAllotRights = (id, parmas) => {
    return http
        .post(`roles/${id}/rights/`, {
            rids: parmas
        })
}
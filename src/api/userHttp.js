import http from '@/utils/http.js'
//获取角色列表数据
export const getUserList = (parmas) => {
    return http
        .get("users", parmas)
}
//修改用户状态
export const getUserStateChange = (parmas) => {
    return http
        .put(`users/${parmas.id}/state/${parmas.mg_state}`, )
}
//添加用户
export const getAddUser = (parmas) => {
    return http
        .post('users', parmas)
}
//查询用户信息
export const getSearchUser = (parmas) => {
    return http
        .get(`users/${parmas}`)
}
//修改用户信息
export const getChangeUser = (id, parmas) => {
    return http
        .put(`users/${id}`, parmas)
}
//删除用户信息
export const getDeleteUser = (id) => {
    return http
        .delete(`users/${id}`)
}
//获取角色列表
export const getRolesList = (parmas) => {
    return http
        .get(`roles`)
}
//分配用户角色  
export const getSaveRoleInfo = (id, parmas) => {
    return http
        .put(`users/${id}/role`, {
            rid: parmas
        })
}
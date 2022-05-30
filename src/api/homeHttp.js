import http from '@/utils/http.js'
//获取左侧菜单
export const getMenuList = () => {
    return http
        .get("menus")
}
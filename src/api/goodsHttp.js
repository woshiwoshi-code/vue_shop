import http from '@/utils/http.js'
// 获取商品列表
export const getCategories = (data) => {
    return http
        .get("categories", {
            params: data
        })
}
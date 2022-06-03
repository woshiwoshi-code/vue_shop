import http from '@/utils/http.js'
// 获取商品列表
export const getCategories = (data) => {
    return http
        .get("categories", {
            params: data
        })
}
//添加分类
export const getAddCategories = (data) => {
    return http
        .post("categories", data)
}
//参数列表
export const getParamsList = (id, params) => {
    return http
        .get(`categories/${id}/attributes`, {
            params: {
                sel: params
            }
        })
}
//添加动态参数或者静态属性
export const getAddParams = (id, params, data) => {
    return http
        .post(`categories/${id}/attributes`, {
            attr_name: params,
            attr_sel: data
        })
}
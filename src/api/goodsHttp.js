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
// 根据 ID 查询参数
export const getEditParmas = (id, params, data) => {
    return http
        .get(`categories/${id}/attributes/${params}`, {
            attr_sel: data
        })
}
//编辑提交参数
export const getPutEditParmas = (id, params, name, data) => {
    return http
        .put(`categories/${id}/attributes/${params}`, {
            attr_name: name,
            attr_sel: data
        })
}
// 删除参数
export const getDeleteParmas = (id, params) => {
    return http
        .delete(`categories/${id}/attributes/${params}`)
}
//编辑提交参数
export const getEdit = (id, params, name, data, val) => {
    return http
        .put(`categories/${id}/attributes/${params}`, {
            attr_name: name,
            attr_sel: data,
            attr_vals: val
        })
}
//--------------------------------------------------------------------------------------------------------------
// 商品管理
//商品列表数据
export const getGoodsList = (params) => {
    return http
        .get(`goods`, {
            params: params
        })
}
//删除商品
export const getRemoveGoods = (id) => {
    return http
        .delete(`goods/${id}`, )
}
//添加商品
export const getGoods = (from) => {
    return http
        .post(`goods`, from)
}
import http from '@/utils/http.js'

//订单列表
export const getOrderList = (data) => {
    return http
        .get("orders", {
            params: data
        })
}
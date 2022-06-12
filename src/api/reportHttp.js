import http from '@/utils/http.js'
// 获取基于时间统计的折线图
export const getReport = () => {
    return http
        .get(`reports/type/1`)
}
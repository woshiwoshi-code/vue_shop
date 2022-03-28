import http from '@/utils/http.js'
//登录接口
export const getLogin = (parmas) => {
    return http
        .post("login", parmas)
}
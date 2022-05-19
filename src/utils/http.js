import axios from 'axios';
// import qs from 'qs'
import store from '@/store/index' //已经设置路径别名，否则相对路径引用
import {
    ElMessage,
    ElLoading
} from "element-plus";
let loading = null
const service = axios.create({
    timeout: 5000, //超时时间
    baseURL: "http://127.0.0.1:8888/api/private/v1/", // 我们在请求接口的时候就不用写前面 会自动我们补全
    // transformRequest: data => qs.stringify(data)    //post请求参数处理,防止post请求跨域
})
// http request 拦截器
service.interceptors.request.use(config => {
    loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    //如果存在jwt，则将jwt添加到每次请求之中..
    if (store.state.jwt) {
        config.params = {
            ...config.params,
            jwt: store.state.jwt
        }
    }
    return config
}, err => {
    return err
})
// http response 拦截器
service.interceptors.response.use(response => {
    loading.close()
    return response
    //接收返回数据..
    // const res = response.data
    //判断返回数据是否存在状态code和错误提示信息..
    // if (!res.code || !res.msg) {
    //     return showMessage('响应数据格式错误', "error")
    // }
    //判断状态code是否为指定数值(200)..
    // if (res.code != 200) {
    //     return showMessage(res.msg)
    // }
    // return res
}, err => {
    console.log("服务器连接失败")

    loading.close()
    return showMessage(err.message)
})

//封装错误提示信息..
function showMessage(message, type = "error", showClose = true) {
    ElMessage({
        showClose, //是否显示X
        message, //错误提示信息
        type, //显示类型
        duration: 3 * 1000 //展示时间
    })
    return Promise.reject()
}
export default service;
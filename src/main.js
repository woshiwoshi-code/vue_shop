import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios';
const app = createApp(App)
//配置请求根路径
// app.config.globalProperties.$http = axios;
// axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 饿了么ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 全局样式表
import './assets/css/global.css';


app.use(store)
app.use(router)
app.use(ElementPlus, {
    size: 'small',
    zIndex: 3000
})
app.mount('#app')
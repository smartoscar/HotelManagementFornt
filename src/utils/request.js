// 请求相关

// 导入nprogress
import NProgress from 'nprogress'
// 导入nprogress的央视
import 'nprogress/nprogress.css'

// 导入axios
import axios from "axios";

// 导入接口跟地址
import { BASE_URL } from '../config/conster.js'
import { $msg_e } from './msg'

// 初始化一个axios对象
var instance = axios.create({
    // 请求地址前缀
    baseURL: BASE_URL,
    // 请求超时时间
    timeout: 10000,
    // 自定义请求头
    headers: { 'token': sessionStorage.getItem('token') }
    // headers: {}
})

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
    NProgress.start();
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    NProgress.done();
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
    NProgress.done();
    // 对响应数据做点什么
    return response;
}, function(error) {
    NProgress.done();
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 导入路由对象
import { useRouter } from 'vue-router'

// 定义get请求方法
export let $get = async(url, params) => {
    try {
        let { data } = await instance.get(url, { params });
        return data
    } catch (error) {
        $msg_e(error)
        $router = useRouter()
        $router.push('/login')
    }
}

export let $post = async(url, params) => {
    try {
        let { data } = await instance.post(url, params);
        return data
    } catch (error) {
        let errCode = error.response.status
        if (errCode == 401) {
            $msg_e(error)
            $router = useRouter()
            $router.push('/login')
        }
    }
}

// 设置token的方法，该方法会将浏览器缓存中的token信息，设置到请求头
export let $setToken = () => {
    // 将token信息，保存到请求头
    instance.defaults.headers['token'] = sessionStorage.getItem('token');
}
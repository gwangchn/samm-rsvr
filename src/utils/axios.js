import axios from 'axios'
/**
 * 定义请求常量
 * TIME_OUT、ERR_OK
 */
export const TIME_OUT = 15000; // 请求超时时间
export const ERR_OK = true; // 请求成功返回状态，字段和后台统一

let { dapiUrl, papiUrl } = KYCFG
let apiUrl = process.env.NODE_ENV === 'development' ? dapiUrl : papiUrl

// 请求超时时间
axios.defaults.timeout = TIME_OUT
// 引入基础路径，开发环境为了方便转发，值为空字符串
axios.defaults.baseURL = apiUrl

// 封装请求拦截
axios.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem('samm-auth') // 获取token
    config.headers['Authorization'] = ''
    if (token != null) { // 如果token不为null，否则传token给后台
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 封装响应拦截，判断token是否过期
axios.interceptors.response.use(
  response => {
    let {
      data
    } = response
    if (data.message === 'token failure!') { // 如果后台返回的错误标识为token过期，则重新登录
      sessionStorage.removeItem('samm-auth') // token过期，移除token
      // 进行重新登录操作
    } else {
      return Promise.resolve(response)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios
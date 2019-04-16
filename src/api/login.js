import axios from '@/utils/axios'
import qs from 'qs'

// 登录
export function login (param) {
  return axios.post('/system/user/v1/login', qs.stringify(param))
}

// 修改登录
export function confirmlogin (param) {
  return axios.put('/system/user/v1/pwd', param)
}

// 获取用户相关信息
export function getUserInfo (username) {
  return axios.get(`water/smallrsvr/common/v1/userdscd/${username}`)
}
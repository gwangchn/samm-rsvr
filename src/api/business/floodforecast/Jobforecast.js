import axios from '@/utils/axios'

// 预报站点
export function forecastSite (param) {
  return axios.post('water/rsvr/floodworkforecast/water/rsvr/floodworkforecast', param)
}

// 修改登录
export function confirmlogin (param) {
  return axios.put('/system/user/v1/pwd', param)
}

// 获取用户相关信息
export function getUserInfo (username) {
  return axios.get(`water/smallrsvr/common/v1/userdscd/${username}`)
}
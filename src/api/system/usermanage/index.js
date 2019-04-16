import axios from '@/utils/axios'

//获得角色
export function getU (param) {
  return axios.get('system/manage/v1/role', 'GET')
}

 //列表查询
export function getUserlist (param) {
  return axios.post(`system/manage/v1/usermanage`,param)
}

 //启用禁用
 export function pausePlay (param) {
  return axios.put(`system/manage/v1/status`,param)
}

 //重置密码
 export function resetPassword (param) {
  return axios.put(`system/manage/v1/resetpwd`,param)
}

 //删除
 export function delList (param) {
  return axios.delete(`system/manage/v1/deluser`,param)
}

//删除
export function addList (param) {
  return axios.post(`system/manage/v1/increase`,param)
}
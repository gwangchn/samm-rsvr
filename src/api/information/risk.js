import axios from '@/utils/axios'

// 获取调度数据列表
export function getRiskList (param) {
  return axios.post(`water/smallrsvr/break/dam/v1/breakinfo`,param)
}

// 获取关注列表
export function getFloowList (param) {
  return axios.post(`water/smallrsvr/break/dam/v1/breakinfo`,param)
}


// 添加删除关注水库
export function getRiskAddFollow ({lid, stcd, flage, sttp}) {
  return axios.get(`water/smallrsvr/common/v1/concernennm/${lid}/${stcd}/${flage}/${sttp}`)
}


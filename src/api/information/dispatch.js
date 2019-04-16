import axios from '@/utils/axios'

// 获取调度数据列表
export function getDispatchList (param) {
  return axios.post(`water/smallrsvr/dispatchwarn/v1/damforecaststcd`,param)
}

// 添加删除关注水库
export function getDispatchIsfollowList ({lid,stcd,flage,sttp}) {
  return axios.get(`water/smallrsvr/common/v1/concernennm/${lid}/${stcd}/${flage}/${sttp}`)
}

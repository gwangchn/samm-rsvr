import axios from '@/utils/axios'

// 获取预警数据列表
export function getWarningList (param) {
  return axios.post(`water/smallrsvr/warn/v1/warninfo`,param)
}

// 添加删除关注水库
export function getWarnAddFollow ({lid, stcd, flage, sttp}) {
  return axios.get(`water/smallrsvr/common/v1/concernennm/${lid}/${stcd}/${flage}/${sttp}`)
}

// 预警站个数
export function getWarnNum ({dscdflage,f, flagRealOrPred, startDate, endDate}) {
  return axios.get(`water/smallrsvr/warn/v1/warnennmcdt/${dscdflage}/${f}/${flagRealOrPred}/${startDate}/${endDate}`)
}


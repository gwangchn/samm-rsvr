import axios from '@/utils/axios'

// 获取雨晴数据列表
export function getRainList (param) {
  return axios.post(`water/smallrsvr/flood/v1/realfloodstcd`,param)
}

// 已经关注站点的数据
export function getFollowList ({ flagRealOrPred,lid, startDate, endDate }) {
  return axios.get(`water/smallrsvr/flood/v1/concernstcdflood/${lid}/${flagRealOrPred}/${startDate}/${endDate}`)
}

// 单站降雨 降雨详情(实测)
export function getStationlive ({ stcd, startDate, endDate }) {
  return axios.get(`water/smallrsvr/flood/v1/basin/realqz/${stcd}/${startDate}/${endDate}`)
}

// 单站降雨 降雨详情(预报)
export function getStationfore ({ stcd, startDate, endDate }) {
  return axios.get(`water/smallrsvr/flood/v1/basin/floodf/${stcd}/${startDate}/${endDate}`)
}

// 添加删除关注站点
export function getAddfollowZ ({ lid,stcd,flage,sttp}) {
  return axios.get(`water/smallrsvr/common/v1/concernstcd/${lid}/${stcd}/${flage}/${sttp}`)
}

// 添加删除关注水库
export function getAddfollowR ({ lid,stcd,flage,sttp }) {
  return axios.get(`water/smallrsvr/common/v1/concernennm/${lid}/${stcd}/${flage}/${sttp}`)
}





import axios from '@/utils/axios'

// 获取雨晴数据列表
export function getRainList (param) {
  return axios.post(`water/smallrsvr/rainfall/v1/stcdrain`,param)
}

// 已经关注站点的数据
export function getFollowList ({ flagRealOrPred,lid, startDate, endDate }) {
  return axios.get(`water/smallrsvr/rainfall/v1/concerndrp/${lid}/${flagRealOrPred}/${startDate}/${endDate}`)
}

// 获取格点降雨
export function getLatticerainfall ({ dscdflage, startDate, endDate }) {
  return axios.get(`water/smallrsvr/rainfall/v1/latticeforecas/${dscdflage}/${startDate}/${endDate}`)
}

// 单站降雨 降雨详情(实测)
export function getStationlive ({ stcd, startDate, endDate }) {
  return axios.get(`water/smallrsvr/rainfall/v1/stcdrealrain/${stcd}/${startDate}/${endDate}`)
}

// 单站降雨 降雨详情(预报)
export function getStationfore ({ stcd, startDate, endDate }) {
  return axios.get(`water/smallrsvr/rainfall/v1/stcdforecastrain/${stcd}/${startDate}/${endDate}`)
}

// 等值面 线
export function getEquivalent ({ dscdflage,flagRealOrPred,la,level, startDate, endDate }) {
  return axios.get(`water/smallrsvr/rainfall/v1/equalline/${dscdflage}/${flagRealOrPred}/${la}/${level}/${startDate}/${endDate}`)
}

// 添加删除关注站点
export function getAddfollowZ ({ lid,stcd,flage,sttp}) {
  return axios.get(`water/smallrsvr/common/v1/concernstcd/${lid}/${stcd}/${flage}/${sttp}`)
}

// 添加删除关注水库
export function getAddfollowR ({ lid,stcd,flage,sttp }) {
  return axios.get(`water/smallrsvr/common/v1/concernennm/${lid}/${stcd}/${flage}/${sttp}`)
}

// 条件查询行政区
export function getStation({ f,dscdflage,dscd }) {
  return axios.get(`water/smallrsvr/common/v1/bscdnm/${f}/${dscdflage}/${dscd}`)
}

// 等值面 线
export function getIsosurfaceLine({ dscdflage,flagRealOrPred,startDate,la,endDate,level }) {
  return axios.get(`water/smallrsvr/rainfall/v1/equalline/${dscdflage}/${flagRealOrPred}/${la}/${startDate}/${endDate}/${level}`)
}





import axios from '@/utils/axios'

// 预警水库列表
export function login ({ dscdflage, f, startDate, endDate }) {
  return axios.get(`water/smallrsvr/homepage/v1/warnennmcd/${dscdflage}/${f}/${startDate}/${endDate}`)
}

// 获取水库预警水位
export function getWarnLine (ennmcd) {
  return axios.get(`water/smallrsvr/common/v1/rsvrwarnz/${ennmcd}`)
}

// 获取水库预报水位
export function getWaterLevel ({ ennmcd, startDate, endDate }) {
  return axios.get(`water/smallrsvr/homepage/v1/rsvrz/${ennmcd}/${startDate}/${endDate}`)
}

// 获取所有观测水库列表
export function getAll ({ dscdflage, f, startDate, endDate }) {
  return axios.get(`water/smallrsvr/homepage/v1/warnennmcd/${dscdflage}/${f}/${startDate}/${endDate}`)
}

// 统计预警个数
export function getStatistics ({ dscdflage, f, startDate, endDate }) {
  return axios.get(`water/smallrsvr/homepage/v1/warnennmcdt/${dscdflage}/${f}/${startDate}/${endDate}`)
}

// 获取所有观测水库详细描述列表
export function getAllDetail ({ dscdflage, f, startDate, endDate }) {
  return axios.get(`water/smallrsvr/homepage/v1/warninfo/${dscdflage}/${f}/${startDate}/${endDate}`)
}

// 等值面
export function getSurface ({ dscdflage, flagRealOrPred, la, startDate, endDate, level }) {
  return axios.get(`water/smallrsvr/rainfall/v1/equalline/${dscdflage}/${flagRealOrPred}/${la}/${startDate}/${endDate}/${level}`)
}

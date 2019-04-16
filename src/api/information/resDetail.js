import axios from '@/utils/axios'

// 详情头信息
export function ennminfo ({ ennmcd, startDate, endDate }) {
  return axios.get(`water/smallrsvr/common/v1/ennminfo/${ennmcd}/${startDate}/${endDate}`)
}

// 雨洪过程
export function floodrain ({ ennmcd, startDate, endDate }) {
  return axios.get(`water/smallrsvr/common/v1/floodrain/${ennmcd}/${startDate}/${endDate}`)
}


// 河道说明
export function rsvrExplain ({ ennmcd, rvsanalyflage}) {
  return axios.get(`water/smallrsvr/common/dam/v1/break/basic/${ennmcd}/${rvsanalyflage}`)
}

// 河道断面信息
export function crossSection ({ ennmcd, rvsanalyflage}) {
  return axios.get(`water/smallrsvr/common/dam/v1/break/section/listing/last/${ennmcd}/${rvsanalyflage}`)
}

// 河道断面详情（溃坝断面点集合） 
export function riverDetail ({cid, rscd}) {
  return axios.get(`water/smallrsvr/common/dam/v1/break/section/detail/${cid}/${rscd}`)
}

// 获取溃坝淹没范围 
export function riverArea (ennmcd) {
  return axios.get(`water/rsvr/dam/v1/break/basic/last/${ennmcd}`)
}
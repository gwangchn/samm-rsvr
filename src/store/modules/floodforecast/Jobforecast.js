import { forecastSite} from '@/api/business/floodforecast/Jobforecast'

let timeType = 'yyyy-MM-dd 08:00:00'
export default {
  namespaced: true,
  state: {
    forecastSiteData: [],
    hideRight:true,
    changeList:false
  },
  getters: {
    forecastSiteData: state => state.forecastSiteData,
    hideRight: state => state.hideRight,
    changeList: state => state.changeList,
  },
  mutations: {
    CHANGE_FORECASTSITEDATA(state, value) {
      state.forecastSiteData = value
    },
    CHANGE_HIDERIGHT(state, value) {
      state.hideRight = value
    },
    CHANGE_CHANGELIST(state, value) {
      state.changeList = value
    }
  },
  actions: {
    // 预报站点
    async getForecastSite({state,commit}, params) {
      let res = await forecastSite(params);
      //vm.$eventBus.$emit('resDetaillist',res.data.result);//地图上秒点
    }
  }
}

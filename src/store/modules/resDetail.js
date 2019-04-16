import { ennminfo, floodrain ,crossSection,riverDetail,rsvrExplain, riverArea} from '@/api/information/resDetail'

let timeType = 'yyyy-MM-dd 08:00:00'
export default {
  namespaced: true,
  state: {
    showFlag: false,
    ennmcd: '',
    list: [],
    dispatchDetail: {
      floodmaxq: null,
      floodmaxqtm: null,
      floodtotal: null
    },
    sectionList:[],//断面列表
    oSectionName:'断面详情',//断面名字
    sectionExplain:[],//断面说明
    risktype:'10年一遇洪水'
  },
  getters: {
    showFlag: state => state.showFlag,
    ennmcd: state => state.ennmcd,
    list: state => state.list,
    dispatchDetail: state => state.dispatchDetail,
    sectionList: state => state.sectionList,
    sectionExplain: state => state.sectionExplain,
    oSectionName: state => state.oSectionName,
    risktype: state => state.risktype
  },
  mutations: {
    CHANGE_SHOWFLAG(state, value) {
      state.showFlag = value
    },
    CHANGE_ENNMCD(state, value) {
      state.ennmcd = value
    },
    CHANGE_LIST(state, value) {
      state.list = value
    },
    CHANGE_DISPATCHDETAIL(state, value) {
      state.dispatchDetail = value
    },
    CHANGE_SECTIONLIST(state, value) {
      state.sectionList = value
    },
    CHANGE_SECTIONEXPLAIN(state, value) {
      state.sectionExplain = value
    },
    CHANGE_OSECTIONNAME(state, value) {
      state.oSectionName = value
    }
  },
  actions: {
    getInfo({ getters: { ennmcd } }, date, vm) {
      return ennminfo({
        ennmcd,
        startDate: new Date(date).formatDate(timeType),
        endDate: new Date(date).datePro('{%d+7}').formatDate(timeType)
      })
    },
    async getRainfall({ getters: { ennmcd }, commit }, { date, vm }) {
      let res = await floodrain({
        ennmcd,
        startDate: new Date(date).datePro('{%d-3}').formatDate(timeType),
        endDate: new Date(date).datePro('{%d+7}').formatDate(timeType)
      })
      let { flood, floodmaxq, floodmaxqtm, floodtotal } = res.data.result

      commit('CHANGE_LIST', [])
      commit('CHANGE_DISPATCHDETAIL', {
        floodmaxq: null,
        floodmaxqtm: null,
        floodtotal: null
      })
      
      vm.$nextTick(() => {
        commit('CHANGE_LIST', flood)
        commit('CHANGE_DISPATCHDETAIL', {
          floodmaxq,
          floodmaxqtm,
          floodtotal
        })
      })
    },
    // 河道断面信息
    async getcrossSection({state,commit}, obj) {
      let [vm,params] = obj;
      let res = await crossSection(params);
      vm.$eventBus.$emit('resDetaillist',res.data.result);//地图上秒点
      vm.$eventBus.$emit('explainDetail',res.data.result);//风险说明
    },
    // 河道断面详情（溃坝断面点集合） 
    async getriverDetail({state,commit}, obj) {
      let [vm,params] = obj;
      let res = await riverDetail(params);
      vm.$eventBus.$emit('showSection',true);
      commit('CHANGE_SECTIONLIST',res.data.result);
    },
    // 河道说明 
    async getrsvrExplain({state,commit}, obj) {
      let [vm,params] = obj;
      let res = await rsvrExplain(params);
      commit('CHANGE_SECTIONEXPLAIN',res.data.result);
    },
    // 获取溃坝淹没范围
    async getArea({getters: { ennmcd }}, obj) {
      let [vm, { rvsanalyflage }] = obj
      let res = await riverArea(ennmcd)
      let data = res.data.result
      data.forEach(value => {
        rvsanalyflage === value.rvsanalyflage && vm.$eventBus.$emit('areaImage', value)
      })
    }
  }
}

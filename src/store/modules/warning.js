import { getWarningList,getWarnAddFollow,getWarnNum} from '@/api/information/warning'

export default {
  namespaced: true,
  state: {
    tableList:[],//全部
    followList:[],//关注
    seniorList:[],//高级
    type:'S',
    startTm:'',
    endTm:'',
    warnNumdata:[]
  },
  getters: {
    tableList(state) {
      return state.tableList
    },
    followList(state) {
      return state.followList
    },
    seniorList(state) {
      return state.seniorList
    },
    type(state) {
      return state.type
    },
    startTm(state) {
      return state.startTm
    },
    endTm(state) {
      return state.endTm
    },
    warnNumdata(state) {
      return state.warnNumdata
    }
  },
  mutations: {
    CHANGE_TABLELIST: (state, value) => {
      state.tableList = value
    },
    CHANGE_FOLLOWLIST: (state, value) => {
      state.followList = value
    },
    CHANGE_SENIORLIST: (state, value) => {
      state.seniorList = value
    },
    CHANGE_TYPE: (state, value) => {
      state.type = value
    },
    CHANGE_STARTTM: (state, value) => {
      state.startTm = value
    },
    CHANGE_ENDTM: (state, value) => {
      state.endTm = value
    },
    CHANGE_WARNNUMDATA: (state, value) => {
      state.warnNumdata = value
    }
  },
  actions: {
    // 全部
    async getWarnListData({state,commit},vm) {
      let option = {
        '1': 'blue',
        '2': 'gold',
        '3': 'red'
      }
      let warnData = await getWarningList({//获取预警数据列表  
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
        f:JSON.parse(sessionStorage.getItem('samm-userinfo')).f, 
        endDate: state.endTm,
        startDate:state.startTm,
        stnm:"",//水库名称           
        execut:"",//条件查询行政属性
        dscdt:"",//条件查询行政编码
        flagRealOrPred:state.type,//S实况、Y预报
        lid:'',
      });
      let FollowData = await getWarningList({//关注预警数据列表
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
        f:JSON.parse(sessionStorage.getItem('samm-userinfo')).f, 
        endDate: state.endTm,
        startDate:state.startTm,
        stnm:"",//水库名称           
        execut:"",//条件查询行政属性
        dscdt:"",//条件查询行政编码
        flagRealOrPred:state.type,//S实况、Y预报
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名 
        sttp:'WW'
      });
      let nWarnData = warnData.data.result;
      let nFollowData = FollowData.data.result;
      nWarnData.map((x)=>{
        x.rz = vm.$util.convertZ(x.rz)
        x.warn = vm.$util.convertP(x.warn)
        x.isClick = false;
        nFollowData.map(res=>{
          if(x.ennmcd.trim() == res.ennmcd.trim()){
            x.isClick = true;
          }
        })
      });
      nWarnData.forEach(value => {
        value.color = option[value.m]
      });
      commit('CHANGE_FOLLOWLIST',nFollowData)
      commit('CHANGE_TABLELIST',nWarnData);
      commit('CHANGE_SENIORLIST',nWarnData);
      vm.$eventBus.$emit('passWarnlist',nWarnData);
    },
    //关注
    async getFollow({state,commit}, obj ) {
      let [vm,para] = obj;
      let res = await getWarnAddFollow({
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
        stcd:para.ennmcd,    
        flage: para.isClick ? 'add' : 'del',
        sttp:'WW'
      });
      if(res.data.result  == '操作成功'){
        let followData =await getWarningList({//关注预警数据列表
          dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
          f:JSON.parse(sessionStorage.getItem('samm-userinfo')).f, 
          endDate: state.endTm,
          startDate:state.startTm,
          stnm:"",//水库名称           
          execut:"",//条件查询行政属性
          dscdt:"",//条件查询行政编码
          flagRealOrPred:state.type,//S实况、Y预报
          lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名 
          sttp:'WW'
        });
        commit('CHANGE_FOLLOWLIST',followData.data.result)
      };
    },
    // 高级
    async getSeniorData({state,commit}, obj) {
      let [vm,param] = obj;
      let warnData = await getWarningList(param);
      let nWarnData = warnData.data.result;
      nWarnData.map((x)=>{
        x.rz = vm.$util.convertZ(x.rz)
        x.warn = vm.$util.convertP(x.warn)
      });
      commit('CHANGE_SENIORLIST',nWarnData);
      vm.$eventBus.$emit('passWarnlist',nWarnData);
    },
    // 预警站个数
    async getWarnNum({state,commit}, vm) {
      let warnNum = await getWarnNum({
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
        f:JSON.parse(sessionStorage.getItem('samm-userinfo')).f, 
        endDate: state.endTm,
        startDate:state.startTm,
        flagRealOrPred:state.type,//S实况、Y预报
      })
      let warnNumdata = warnNum.data.result;
      commit('CHANGE_WARNNUMDATA',warnNumdata);
    },
  }
}

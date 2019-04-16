import { getDispatchList, getDispatchIsfollowList } from '@/api/information/dispatch'
let timeType = 'yyyy-MM-dd 08:00:00'
export default {
  namespaced: true,
  state: {
    tableList:[],//全部
    followList:[],//关注
    seniorList:[],//高级
    type:'S',
    startTm:'',
    endTm:'',
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
    }
  },
  actions: {
    // 全部
    async getDispatchListData ({state, commit},vm){
      let dispatchData = await getDispatchList({//全部
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
        flagRealOrPred:state.type,//S实况、Y预报
        endDate: state.endTm,
        startDate:state.startTm,
        ennm:"",//水库名称             
        execut:"",//条件查询行政属性
        dscdt:"",//条件查询行政编码
        z:"",//库水位达到起调水位
        lid:"",//用户名 
        sttp:''
      })
      let dispatchFollowData = await getDispatchList({//关注
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政 
        flagRealOrPred:state.type,//S实况、Y预报
        endDate: state.endTm,
        startDate:state.startTm,
        ennm:"",//水库名称             
        execut:"",//条件查询行政属性
        dscdt:"",//条件查询行政编码
        z:"",//库水位达到起调水位
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名 
        sttp:'DD'
      })
      let ndispatchData = dispatchData.data.result;
      let ndispatchFollowData = dispatchFollowData.data.result;
      ndispatchData.map((x)=>{
        x.isClick = false;
        x.rz = x.rz ? x.rz.toFixed(1) : ''
        x.inq = x.inq ? x.inq.toFixed(1) : ''
        x.otq = x.otq ? x.otq.toFixed(1) : ''
        ndispatchFollowData.map(res=>{
          if(x.ennmcd.trim() == res.ennmcd.trim()){
            x.isClick = true;
          }
        })
      });
      commit('CHANGE_TABLELIST',ndispatchData);
      commit('CHANGE_SENIORLIST',ndispatchData);
      commit('CHANGE_FOLLOWLIST',ndispatchFollowData);
      vm.$eventBus.$emit('passDislist',[ndispatchData,state.type]);
    },
    //是否关注
    async getDispatchFollow({state,commit}, obj ) { 
      let [vm,para] = obj;
      let res = await getDispatchIsfollowList({
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
        stcd:para.ennmcd,    
        flage: para.isClick ? 'add' : 'del',
        sttp:'DD'
      });

      if(res.data.result  == '操作成功'){
        let followData =await getDispatchList({//关注预警数据列表
          dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
          flagRealOrPred:state.type,//S实况、Y预报
          endDate: state.endTm,
          startDate:state.startTm,
          ennm:"",//水库名称             
          execut:"",//条件查询行政属性
          dscdt:"",//条件查询行政编码
          z:"",//库水位达到起调水位
          lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
          sttp:'DD' 
        });
        let tempData = followData.data.result;
        commit('CHANGE_FOLLOWLIST',tempData)
      };
    },
  //  高级
    async getSeniorData({state,commit}, obj) {
      let [vm,param] = obj;
      let dispatchSeniorData = await getDispatchList(param);
      let ndispatchSeniorData = dispatchSeniorData.data.result;
      commit('CHANGE_SENIORLIST',ndispatchSeniorData);
      vm.$eventBus.$emit('passDislist',ndispatchSeniorData);
    },
  }
}

import { getRiskList,getFloowList,getRiskAddFollow} from '@/api/information/risk'
export default {
  namespaced: true,
  state: {
    tableList:[],//全部
    followList:[],//关注
    seniorList:[],//高级
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
    }
  },
  actions: {
    //全部
    async getRiskList({state,commit}, vm) {
      let starttime = new Date().formatDate('yyyy-MM-dd 08:00:00')
      let endtime = new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00');
      let riskData = await getRiskList({//获取微信数据列表
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
        startDate:starttime,//起始时间 
        endDate:endtime,//结束日期   
        lid:'',//用户名 
        ennm:"",//水库名称             
        execut:"",//条件查询行政属性
        dscdt:"",//条件查询行政编码
      });
      let FollowData = await getFloowList({//关注微信数据列表
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,
        startDate:starttime, 
        endDate:endtime, 
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,
        ennm:"",//水库名称             
        execut:"",//条件查询行政属性
        dscdt:"",//条件查询行政编码
      });
      let nRiskData = riskData.data.result;
      let nFollowData = FollowData.data.result;
      nRiskData.map((x)=>{
        x.isClick = false;
        nFollowData.map(res=>{
          if(x.ennmcd.trim() == res.ennmcd.trim()){
            x.isClick = true;
          }
        })
      });
      commit('CHANGE_FOLLOWLIST',nFollowData);
      commit('CHANGE_TABLELIST',nRiskData);
      commit('CHANGE_SENIORLIST',nRiskData);
      vm.$eventBus.$emit('passRisklist',nRiskData);
    },
    //关注
    async getFollow({state,commit}, obj ) { 
      let starttime = new Date().formatDate('yyyy-MM-dd 08:00:00')
      let endtime = new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00');
      let [vm,para] = obj;
      let res = await getRiskAddFollow({
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
        stcd:para.ennmcd,    
        flage: para.isClick ? 'add' : 'del',
        sttp:'FX'
      });
      if(res.data.result  == '操作成功'){
        let followData =await getRiskList({//关注预警数据列表
          lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
          startDate:starttime, 
          endDate:endtime, 
          dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,
          ennm:"",//水库名称             
          execut:"",//条件查询行政属性
          dscdt:"",//条件查询行政编码
        });
        commit('CHANGE_FOLLOWLIST',followData.data.result)
      };
    },
    // 高级
    async getSeniorData({state,commit}, obj) {
      let [vm,param] = obj;
      let riskData = await getRiskList(param);
      let nRiskData = riskData.data.result;
      commit('CHANGE_SENIORLIST',nRiskData);
      vm.$eventBus.$emit('passRisklist',nRiskData);
    }
  }
}

import { getRainList,getFollowList,getAddfollowZ,getAddfollowR,getStationlive,getStationfore} from '@/api/information/water'
export default {
  namespaced: true,
  state: {
    tableList:[],//全部
    followList:[],//关注
    seniorList:[],//高级
    type:'S',
    startTm:'',
    endTm:'',
    foreliveDetails:[]
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
    districtList(state) {
      return state.districtList
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
    foreliveDetails(state) {
      return state.foreliveDetails
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
    CHANGE_DISTRICTLIST: (state, value) => {
      state.districtList = value
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
    CHANGE_FORELIVEDETAILS: (state, value) => {
      state.foreliveDetails = value
    }
  },
  actions: {
    //全部
    async getListData({state,commit}, obj) {
      let type = state.type;
      let [vm,date] = obj;
      let rData = await getRainList(Object.assign(date,{
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政
        flagRealOrPred:type,
        stnm:'',//水库名称
        drp1:'',//起始降雨量
        drp2:'',//结束降雨量 
        execut:'',//条件查询行政属性
        dscdt:'',//条件查询行政编码
      }));
      let followData =await getFollowList(Object.assign(date,{ 
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
        flagRealOrPred:type
      }));
      let nWaterData = rData.data.result;
      let nFollowData = followData.data.result;
      nWaterData.map((x)=>{
        x.type = type;
        x.isClick = false;
        nFollowData.map(res=>{
          if(x.stcd.trim() == res.stcd.trim()){
            x.isClick = true;
          }
        })
      });
      commit('CHANGE_FOLLOWLIST',nFollowData)
      commit('CHANGE_TABLELIST',nWaterData);
      commit('CHANGE_SENIORLIST',nWaterData);
      vm.$eventBus.$emit('passWaterlist',nWaterData);
    },
    //高级
    async getSeniorData({state,commit}, obj) {
      let [vm,param] = obj;
      let rData = await getRainList(param);
      let nWaterData = rData.data.result;
      commit('CHANGE_SENIORLIST',nWaterData);
      vm.$eventBus.$emit('passWaterlist',nWaterData);
    },
    //添加删除关注站点
    async getFollowSite({state,commit}, obj) {
      let [vm,para] = obj;
      let res = await getAddfollowZ({
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
        stcd:para.stcd.trim(),
        flage: para.isClick ? 'add' : 'del',
        sttp:'RR'
      });
      if(res.data.result  == '操作成功'){
        let date = {
          startDate:state.startTm,
          endDate:state.endTm
        };
        let followData =await getFollowList(Object.assign(date,{
          lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
          flagRealOrPred:'S'
        }));
        commit('CHANGE_FOLLOWLIST',followData.data.result)
      }
    },
    //添加删除关注水库
    async getFollowRsvr({state,commit}, obj) {
      let [vm,para] = obj;
      let res = await getAddfollowR({
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
        stcd:para.stcd.trim(),
        flage: para.isClick ? 'add' : 'del',
        sttp:'RR'
      });
      if(res.data.result  == '操作成功'){
        let date = {
          startDate:state.startTm,
          endDate:state.endTm
        };
        let followData =await getFollowList(Object.assign(date,{
          lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
          flagRealOrPred:'Y'
        }));
        commit('CHANGE_FOLLOWLIST',followData.data.result)
      }
    },
    //单站降雨 降雨详情(预报)
    async getStationforeVuex({state,commit},param) {
      let date = {
        startDate:state.startTm,
        endDate:state.endTm
      };
      let res = await getStationfore(Object.assign(date,param));
      let data = res.data.result;
      data.map(x=>{
        x.tm = x.tm == null ?'': x.tm.toDate().formatDate('yyyy-MM-dd HH:mm');
        x.inq = x.inq == null ?'': x.inq;
      });
      commit('CHANGE_FORELIVEDETAILS',data)
    },
    //单站降雨 降雨详情(实测)
    async getStationliveVuex({state,commit},param) {
      let date = {
        startDate:state.startTm,
        endDate:state.endTm
      };
      let res = await getStationlive(Object.assign(date,param));
      let data = res.data.result;
      data.map(x=>{
        x.tm = x.tm == null ?'': x.tm.toDate().formatDate('yyyy-MM-dd HH:mm');
        x.inq = x.inq == null ?'': x.inq;
      }) 
      commit('CHANGE_FORELIVEDETAILS',data)
    }
  }
}

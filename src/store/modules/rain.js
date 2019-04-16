import { getRainList,getFollowList,getAddfollowZ,getAddfollowR ,getStation,
  getLatticerainfall,getStationlive,getStationfore,getIsosurfaceLine} from '@/api/information/rain'

export default {
  namespaced: true,
  state: {
    tableList:[],//全部
    followList:[],//关注
    seniorList:[],//高级
    districtList:[],//行政区划列表
    gap:'1',
    type:'S',
    startTm:'',
    endTm:'',
    foreliveDetails:[],
    Lattice:true,//格点雨量隐藏
    Isosurface:true//等值面隐藏
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
    gap(state) {
      return state.gap
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
    },
    Lattice(state) {
      return state.Lattice
    },
    Isosurface(state) {
      return state.Isosurface
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
    CHANGE_GAP: (state, value) => {
      state.gap = value
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
    },
    CHANGE_LATTICE: (state, value) => {
      state.Lattice = value
    },
    CHANGE_ISOSURFACE: (state, value) => {
      state.Isosurface = value
    }
  },
  actions: {
    //全部
    async getListData({state,commit}, obj) {
      let type = state.type;
      let [vm,date] = obj;
      let rainData = await getRainList(Object.assign(date,{
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
      let nRainData = rainData.data.result;
      let nFollowData = followData.data.result;
      nRainData.map((x)=>{
        x.type = type;
        x.isClick = false;
        x.drp = x.drp == null ? '' :  x.drp;
        nFollowData.map(res=>{
          if(x.stcd.trim() == res.stcd.trim()){
            x.isClick = true;
          }
        })
      });
      commit('CHANGE_FOLLOWLIST',nFollowData)
      commit('CHANGE_TABLELIST',nRainData);
      commit('CHANGE_SENIORLIST',nRainData);
      vm.$eventBus.$emit('passRainlist',nRainData);
    },
    //高级
    async getSeniorData({state,commit}, obj) {
      let [vm,param] = obj;
      let rainData = await getRainList(param);
      let nRainData = rainData.data.result;
      nRainData.map((x)=>{
        x.drp = x.drp == null ? '' :  x.drp;
      });
      commit('CHANGE_SENIORLIST',nRainData);
      vm.$eventBus.$emit('passRainlist',nRainData);
    },
    //添加删除关注站点
    async getFollowSite({state,commit}, obj) {
      let [vm,para] = obj;
      let res = await getAddfollowZ({
        lid:JSON.parse(sessionStorage.getItem('samm-userinfo')).lid,//用户名
        stcd:para.stcd.trim(),
        flage: para.isClick ? 'add' : 'del',
        sttp:'PP'
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
        sttp:'PP'
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
    //条件查询行政区
    async getStation({state,commit}) {
      let res = await getStation({
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政
        dscd:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscd,
        f:JSON.parse(sessionStorage.getItem('samm-userinfo')).f
      });
      let district = res.data.result;
      district.map((x)=>{
        x.label = x.dsnm;
        x.value = `${x.dscd}${x.execut}`;
      });
      function GetParentArry( arry) {
        let map = {};
        arry.forEach( x=> {
            map[x.dscd] = x;
        });
        let newArry = [];
        arry.forEach(item => {
          let parent = map[item.fatherid];
          if (parent) {
            (parent.children || ( parent.children = [] )).push(item);
          } else {
            newArry.push(item);
          }
        });
        return newArry;
      };
      commit('CHANGE_DISTRICTLIST',GetParentArry(district))
    },
    //单站降雨 降雨详情(预报)
    async getStationfore({state,commit},param) {
      let date = {
        startDate:state.startTm,
        endDate:state.endTm
      };
      let res = await getStationfore(Object.assign(date,param));
      let data = res.data.result;
      data.map(x=>{
        x.ftm = x.ftm == null ?'': x.ftm.toDate().formatDate('yyyy-MM-dd HH:mm');;
        x.fpp = x.fpp == null ?'': x.fpp;
      });
      commit('CHANGE_FORELIVEDETAILS',data)
    },
    //单站降雨 降雨详情(实测)
    async getStationlive({state,commit},param) {
      let date = {
        startDate:state.startTm,
        endDate:state.endTm
      };
      let res = await getStationlive(Object.assign(date,param));
      let data = res.data.result;
      data.map(x=>{
        x.ftm = x.ftm == null ?'': x.ftm.toDate().formatDate('yyyy-MM-dd HH:mm');
        x.fpp = x.fpp == null ?'': x.fpp;
      }) 
      commit('CHANGE_FORELIVEDETAILS',data)
    },
    //格点降雨
    async getLatticerainfall({state,commit},vm) {
      let param = {
        dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政
        startDate:state.startTm,
        endDate:state.endTm
      };
      let res = await getLatticerainfall(param);
      vm.$eventBus.$emit('passLatticeRain',res.data.result);
    },
    //等值面 线
    async getIsosurfaceLine({state,commit},obj) {
      let [vm,date] = obj;
      let userinfo = JSON.parse(sessionStorage.getItem('samm-userinfo'));
      let type = state.type;
      let level = null
      switch (Number(state.gap)) {
        case 1:
        level = [0.1, 1.6, 7, 15, 40, 50]
          break
        case 3:
        level = [0.1, 3, 10, 20, 50, 70]
          break
        case 6:
        level = [0.1, 4, 13, 25, 60, 120]
          break
        case 12:
        level = [0.1, 5, 15, 30, 70, 140]
          break
        case 24:
        level = [0.1, 10, 25, 50, 100, 250]
          break
        case 72:
        level = [0.1, 30, 75, 150, 300, 750]
          break
      }
      let param = {
        dscdflage: userinfo.dscdflage,
        flagRealOrPred: type,
        la: 'A',
        level: level
      };
      let res = await getIsosurfaceLine(Object.assign(date,param));
      vm.$eventBus.$emit('IsosurfaceLine',res.data.result);
    }
  }
}

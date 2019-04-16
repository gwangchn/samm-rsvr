<template>
  <div class="dispatchSeniorbox">
    <div class="senior">
      <div class="seniorT">
        <span class="title">行 政 区 :</span>
        <el-cascader size="small" :options="districtList" style="width: 240px" v-model="district" :change-on-select="true"></el-cascader>
      </div>
      <div class="seniorB">
        <span class="title">水库名称:</span>
        <el-input v-model="rsvrName" size="small" style="width: 240px" placeholder="" /></el-input>
      </div>
      <div class="seniorC">
        <span class="title">水库状态:</span>
        <Checkbox v-model="single"> 库水位到达起调水位</Checkbox>
      </div>
      <div class="seniorBottom">
        <el-button type="success" size="small" @click="lookup"> 查 找 </el-button>
      </div>
    </div>
    <div ref="tableheight" class="tableBox">
      <Table :height="listheight" :columns="columns1" :data="seniorList"></Table>
    </div>
  </div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
export default {
    name:'senior',
    data(){
      return{
          single:false,
          value3:"",
          district:[],
          columns1: [{
                      title: '库名',
                      key: 'ennm',
                      align: 'center'
                  },
                  {
                      title: '水位(m)',
                      key: 'rz',
                      align: "center",
                      renderHeader: (h) => {
                          return h('p', [
                              h('span', null, '水位'),
                              h('br'),
                              h('span', null, '(m)')
                          ])
                      }
                  },
                  {
                      title: '入流(m³/s)',
                      key: 'inq',
                      align: "center",
                      renderHeader: (h) => {
                          return h('p', [
                              h('span', null, '入流'),
                              h('br'),
                              h('span', null, '(m³/s)')
                          ])
                      }
                  },
                  {
                      title: '泄流(m³/s)',
                      key: 'otq',
                      align: "center",
                      renderHeader: (h) => {
                          return h('p', [
                              h('span', null, '泄流'),
                              h('br'),
                              h('span', null, '(m³/s)')
                          ])
                      }
                  },
                  {
                      title: '起调水位',
                      key: 'rgz',
                      align: "center",
                      renderHeader: (h) => {
                          return h('p', [
                              h('span', null, '起调水位'),
                              h('br'),
                              h('span', null, '(m)')
                          ])
                      }
                  }
              ],
          sRain:'',
          eRain:'',
          rsvrName:'',
          listheight:''
    }
    },
    computed: {
        ...mapGetters('dispatch', ['seniorList','type','gap','startTm','endTm']),
        ...mapGetters('rain', ['districtList']),
    },
    
    mounted(){
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
      this.getStation();
    },
    methods:{
      // 查找
      lookup(){
          let {startTm,endTm,type,sRain,eRain,rsvrName,district,single} = this;
          let oLength = district.length;
          let execut = oLength > 0 ?district[oLength-1].substr(district[oLength-1].length - 1):'';
          let dscdt = oLength > 0 ?  district[oLength-1].substr(0,district[oLength-1].length - 1):'';
          this.getSeniorData([this,{
            dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
            startDate:startTm,//起始时间  
            endDate:endTm,//结束日期         
            flagRealOrPred:type,//S实况、Y预报
            ennm:"",//水库名称             
            execut:execut,//条件查询行政属性
            dscdt:dscdt,//条件查询行政编码
            z:single ? 'Y' : 'N',//库水位达到起调水位
            lid:""//用户名 
          }]);
      },
      ...mapActions('rain',['getStation']),
      ...mapActions('dispatch',['getSeniorData'])
    }
}
</script>
<style lang="scss" scoped>
.dispatchSeniorbox{
  .senior{
    height:160px;
    margin: 0 auto;
    .title{
      display: block;
      width: 60px;
      float: left;
      text-align: right;
      height: 40px;
      font-size: 12px;
    }
    .seniorT{
      line-height:40px;
      text-align: center;
    }
    .seniorC{
      line-height:40px;
      text-align: center;
    }
    .seniorB{
      line-height:40px;
      text-align: center;
    }
    .seniorBottom{
      width:310px;
      line-height:40px;
      text-align: right;
    }
  }
  .tableBox{
    height: calc(100vh - 235px - #{$header-height});
  }
}
</style>
<style lang="scss">
.dispatchSeniorbox{
  .ivu-table-cell{
    padding-left:0px; 
    padding-right: 0px; 
  }  
  .seniorC .ivu-checkbox-wrapper{
    width: 230px;
    text-align: left;
  }
}
</style>

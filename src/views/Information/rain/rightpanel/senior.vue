<template>
  <div class="seniorbox">
    <div class="senior">
      <div class="seniorT">
        <span class="title">行 政 区 :</span>
        <el-cascader size="small" :options="districtList" style="width: 240px" v-model="district" :change-on-select="true"></el-cascader>
      </div>
      <div class="seniorC">
        <span class="title">日 雨 量 :</span>
        <el-input v-model="sRain" size="small" style="width:110px" placeholder="" /></el-input>
        至
        <el-input v-model="sRain" size="small" style="width:110px" placeholder="" /></el-input>
      </div>
      <div class="seniorB">
        <span class="title">水库名称:</span>
        <el-input v-model="rsvrName" size="small" style="width: 240px" placeholder="" /></el-input>
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
            district: [],
            columns1: [
                {
                    title: '站名',
                    key: 'stnm',
                    align: 'center'
                },
                {
                    title: '降水量(mm)',
                    key: 'drp',
                    align: 'center'
                }
            ],
            sRain:'',
            eRain:'',
            rsvrName:'',
            listheight:''
      }
    },
    mounted(){
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
      this.getStation();
    },
     methods:{
      // 查找
      lookup(){
          let {startTm,endTm,type,sRain,eRain,rsvrName,district} = this;
          let oLength = district.length;
          let execut = oLength> 0 ? district[oLength-1].substr(district[oLength-1].length - 1):'';
          let dscdt = oLength> 0 ? district[oLength-1].substr(0,district[oLength-1].length - 1): '';
          this.getSeniorData([this,{
            dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政
            flagRealOrPred:type,
            stnm:rsvrName,//水库名称
            drp1:sRain,//起始降雨量
            drp2:eRain,//结束降雨量 
            execut:execut,//条件查询行政属性
            dscdt:dscdt,//条件查询行政编码
            startDate:startTm,
            endDate:endTm
          }]);
      },
      ...mapActions('rain',['getSeniorData','getStation'])
    },
    computed: {
      ...mapGetters('rain', ['seniorList','type','gap','startTm','endTm','districtList'])
    }
}
</script>
<style lang="scss" scoped>
.seniorbox{
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
      .ivu-cascader{
        display: inline-block;
      }
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
      text-align: right;
    }
  }
  .tableBox{
    height: calc(100vh - 235px - #{$header-height});
  }
}
</style>
<template>
  <div class="seniorbox">
    <div class="senior">
      <div class="seniorT">
        <span class="title">行 政 区 :</span>
        <el-cascader size="small" :options="districtList" style="width: 238px" v-model="district" :change-on-select="true"></el-cascader>
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
import expandRow from './table-expand.vue';
import {
    mapGetters,
    mapActions
} from 'vuex'
export default {
    name:'senior',
    data(){
      return{
        district:[],
        columns1: [
          {
            type: 'expand',
            width: 30,
            key: 'name',
            render: (h, params) => {
                return h(expandRow, {
                    props: {
                        row: params.row
                    }
                })
            }
          },
          {
            title: '洪水量级',
            key: 'ennm',
            width: 120,
            align: "center"
          },
          {
            title: '下泄流量(m³/s)',
            key: '',
            align: "center",
            renderHeader: (h) => {
              return h('p', [
                h('span', null, '下泄流量'),
                h('br'),
                h('span', null, '(m³/s)')
              ])
            }
          },
          {
            title: '淹没面积',
            key: '',
            align: "center",
            renderHeader: (h) => {
              return h('p', [
                h('span', null, '淹没面积'),
                h('br'),
                h('span', null, '(km²)')
              ])
            }
          }
        ],
        rsvrName:'',
        listheight:''
      }
    },
    computed: {
        ...mapGetters('risk', ['seniorList']),
        ...mapGetters('rain', ['districtList'])
    },
    mounted(){
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
      this.getStation();
    },
    methods:{
      // 查找
      lookup(){
        let {rsvrName,district} = this;
        let starttime = new Date().formatDate('yyyy-MM-dd 08:00:00')
        let endtime = new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00');
        let oLength = district.length;
        let execut = oLength > 0 ?district[oLength-1].substr(district[oLength-1].length - 1):'';
        let dscdt = oLength > 0 ?  district[oLength-1].substr(0,district[oLength-1].length - 1):'';
        this.getSeniorData([this,{
          startDate:starttime,
          endDate:endtime,
          dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政
          lid:'',//用户名
          ennm:rsvrName,//水库名称
          execut:execut,//条件查询行政属性
          dscdt:dscdt,//条件查询行政编码
        }]);
      },
      ...mapActions('rain',['getStation']),
      ...mapActions('risk',['getSeniorData'])
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
  .seniorbox{
    .ivu-table-tbody{
      .ivu-table-cell-with-expand{
        height: 30px; 
        line-height: 30px; 
      }
      td.ivu-table-expanded-cell{
        padding: 5px 0 5px 30px;
      }
      .ivu-col-span-8{
        text-align:center;
      }
    } 
  }
</style>

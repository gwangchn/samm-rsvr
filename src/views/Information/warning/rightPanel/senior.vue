<template>
  <div class="warnseniorbox">
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
import {
    mapGetters,
    mapActions
} from 'vuex'
let option = {
    '1': 'blue',
    '2': 'gold',
    '3': 'red'
  }
export default {
    name:'senior',
    data(){
        return{
            baseUrl: process.env.BASE_URL,
            district:[],
            columns1: [{
                        title: '库名',
                        key: 'ennm',
                        align: 'center',
                        render: (h, params) => {
                        return h('div', [
                          h('span', {
                            style: {
                              display: 'block',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis'
                            },
                            domProps: {
                              title:params.row.ennm
                            }
                          }, params.row.ennm)
                        ]);
                      }
                    },
                    {
                        title: '行政区',
                        key: 'dsnm1',
                        align: "center",
                        render: (h, params) => {
                        return h('div', [
                          h('span', {
                            style: {
                              display: 'block',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis'
                            },
                            domProps: {
                              title:params.row.dsnm1
                            }
                          }, params.row.dsnm1)
                        ]);
                      }
                    },
                    {
                        title: '时间',
                        key: 'ftm',
                        align: "center",
                        render: (h, params) => {
                        return h('div', [
                          h('span', {
                            style: {
                              display: 'block',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis'
                            },
                            domProps: {
                              title:params.row.ftm.toDate().formatDate('MM-dd HH:mm')
                            }
                          }, params.row.ftm.toDate().formatDate('MM-dd HH:mm'))
                        ]);
                      }
                    },
                    {
                        title: '水位(m)',
                        key: 'rz',
                        align: "center"
                    },
                     {
                        title: '超警(m)',
                        key: 'warn',
                        render: (h, params) => {
                        let { baseUrl } = this
                        let item = params.row 
                        return h('div', {
                        attrs: {
                            class: 'table-name-wrap'
                        }
                        }, [
                        h('img', {
                            attrs: {
                            src: `${baseUrl}img/${option[item.m]}.png`,
                            class: 'table-name-img'
                            }
                        }),
                        h('span', {
                            attrs: {
                            class: 'table-name-text'
                            }
                        }, item.warn)
                        ])
                    }
                    },
                ],
            rsvrName:'',
            listheight:''
      }
    },
    computed: {
        ...mapGetters('warning', ['seniorList','type','startTm','endTm']),
        ...mapGetters('rain', ['districtList'])
    },
    mounted(){
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
      this.getStation();
    },
     methods:{
      // 查找
     lookup(){
          let {startTm,endTm,type,rsvrName,district} = this;
          let oLength = district.length;
          let execut = oLength > 0 ?district[oLength-1].substr(district[oLength-1].length - 1):'';
          let dscdt = oLength > 0 ?  district[oLength-1].substr(0,district[oLength-1].length - 1):'';
          this.getSeniorData([this,{
            dscdflage:JSON.parse(sessionStorage.getItem('samm-userinfo')).dscdflage,//用户所属行政  
            startDate:startTm,//起始时间  
            endDate:endTm,//结束日期    
            f:JSON.parse(sessionStorage.getItem('samm-userinfo')).f, 
            flagRealOrPred:type,//S实况、Y预报
            ennm:rsvrName,//水库名称
            execut:execut,//条件查询行政属性
            dscdt:dscdt,//条件查询行政编码
            lid:""//用户名 
          }]);
      },
      ...mapActions('rain',['getStation']),
      ...mapActions('warning',['getSeniorData'])
    }
}
</script>
<style lang="scss" scoped>
.warnseniorbox{
  .senior{
    height:130px;
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
    height: calc(100vh - 205px - #{$header-height});
  }
}
</style>
<style lang="scss">
.warnseniorbox{
    .ivu-table-cell{
      padding-left:0px; 
      padding-right: 0px; 
    }
    .table-name-img {
      vertical-align: middle;
      display: inline-block;
      width: 18px;
      height: 18px;
    }
}
</style>
<template>
  <div class="leftCondition Jobforecast">
    <div class="contion">
      <div class="oldBox" v-if="!changeList">
        <span class="type border">预报站点:</span>
        <span class="type typeinput ">
          <Input  v-model="rsvrstation" @click="search(rsvrstation)" @keyup.native.enter="search(rsvrstation)"
          style="width: 180px"  placeholder="请输入政区或水库名称">
            <Button slot="append" icon="ios-search" @click="search"></Button>
          </Input>
        </span>
        <div class="station" >
          <ul class="border_line" v-for="(item,index) in rsvrs"  :key='index'>
            <li @click="changeRsvr(item,index)" :class="{ clickStyle:index == currentIndex}">
              <Icon type="ios-play" />
              <span class="title">{{item.name}}</span>  
            </li>
          </ul>
        </div>
        <span class="type">预报方案:</span>
        <div class="kase">
          <ul class="border_line" v-for="(item,index) in fKase"  :key='index'>
            <li @click="changeKase(item,index)" :class="{ clickStyle:index == currentIndexk}">
              <Icon type="ios-play" />
              <span class="title">{{item.name}}</span>  
            </li>
          </ul>
        </div>
      </div>
      <div class="newBox" v-if="changeList">
       <Tree :data="data1"></Tree>
      </div>
    </div>
    <div class="oTime">
      <span class="type">预报时间:</span>
      <div class="ftime">
        <div class="WarmPeriod">
          <span>预热期:</span>
          <Select v-model="WarmPeriod" size='small'  style="width:90px">
            <Option v-for="item in WarmPeriods"  :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          天
        </div>
        <div class="ForesightPeriod">
          <span>预见期:</span>
          <Input class="input" size='small' v-model="ForesightPeriod"  style="width:90px"    placeholder="" />
          小时
        </div>
        <div class="time">
          <span>起始日期:</span>
          <el-date-picker v-model="startTm" size="small" format='yyyy-MM-dd HH' type="date"  style="width: 110px"></el-date-picker>
        </div>
        <div class="time">
          <span>预报日期:</span>
          <el-date-picker v-model="forecastTm" size="small" format='yyyy-MM-dd HH'  type="date" style="width: 110px"></el-date-picker>
        </div>
        <div class="time">
          <span>结束日期:</span>
          <el-date-picker v-model="endTm" size="small" format='yyyy-MM-dd HH' type="date"  style="width: 110px"></el-date-picker>
        </div>
        <div class="showButton" v-if="changeList">
          <div class="show1">
            <span><Button type="error" size='small' style="width: 80px">重新计算</Button></span>
            <span><Button type="success" size='small' style="width: 80px">未来降雨</Button></span>
          </div>
          <div class="show1">
            <span><Button type="primary" size='small' style="width: 80px">实时校正</Button></span>
            <span><Button type="warning" size='small' style="width: 80px">调洪演算</Button></span>
          </div>
        </div>
        <div class="sure">
          <Button type="success" size='small' @click="startForecast" style="width: 180px">开始预报</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  name: 'leftCondition',
  data() {
    return {
      rsvrstation:'',
      rsvrs:[
        {name:'中心'},
        {name:'小太平河站'}
      ],
      fKase:[
        {
          name:'三水源新安江',
          value:'1'
        },
        {
          name:'汇流单位线',
          value:'2'
        }
      ],
      currentIndex:'',
      currentIndexk:'',
      WarmPeriod:'',
      WarmPeriods: [
        {
            value: '3',
            label: '3'
        },
        {
            value: '6',
            label: '6'
        }
      ],
      ForesightPeriod:'168',
      startTm:'2018-12-17 08:00',
      forecastTm:'2018-12-17 08:00',
      endTm:'2018-12-17 08:00',
      data1: [
        {
          title: '中心水库',
          expand: true,
          children: [
            {
              title: '中心水库一分区',
            },
            {
              title: '中心水库二分区',
            },
            {
              title: '中心水库三分区',
            }
        ]
      }
    ]
    };
  },
  computed:{
    ...mapGetters('Jobforecast',['forecastSiteData','hideRight','changeList'])
  },
  methods:{
    search(){
      let {rsvrstation} = this;
      let param = {
        stnm:rsvrstation
      };
      //this.getForecastSite(param);
    },
    //开始预报
    startForecast(){
      this.CHANGE_CHANGELIST(true);
      this.CHANGE_HIDERIGHT(false);
    },
    changeRsvr(item,index){
      this.currentIndex = index;
    },
    changeKase(item,index){
      this.currentIndexk = index;
    },
    ...mapMutations('Jobforecast',['CHANGE_FORECASTSITEDATA','CHANGE_HIDERIGHT','CHANGE_CHANGELIST']),
    ...mapActions('Jobforecast',['getForecastSite'])
  }
}
</script>

<style scoped lang="scss">
  $span_width:70px;
  $s_height:40px;
  .Jobforecast{
    width: 200px;
    height: calc(100vh - 40px - #{$header-height});
    border-right: 1px solid #ddd; 
    float: left;
    .contion{
      width: 100%;
      height: 330px;
      .oldBox{
        width: 100%;
        height: 100%;
      }
      .oldBox{
        width: 100%;
        height: 100%;
      }
      .newBox{
        width: 100%;
        height: 100%;
      }
      .type{
        width: 100%;
        line-height: 30px;
        display: inline-block;
        font-size: 13px;
        font-weight: 900;
        padding-left: 10px;
      }
      .station{
        width: 100%;
        height: 150px;
        margin: 5px 0 0 0 ;
        overflow-y: auto;
        border-bottom: 1px solid #ddd;
      }
      .kase{
        width: 100%;
        height: 80px;
        padding-top: 5px;
        overflow-y: auto;
      }
      .border_line {
        li{
          width: 100%;
          line-height: 25px;
          padding-left: 10px;
          font-size: 14px;
          cursor: pointer;
          .title{
            padding-left: 5px;
            display: inline-block;
            height: 100%;
          }
        }
        .clickStyle{
          color:rgb(100, 185, 249);
        }
      }
    }
    .oTime{
      width: 100%;
      height: calc(100% - 330px);
      border-top: 1px solid #ddd;
      .type{
        width: 100%;
        line-height: 30px;
        display: inline-block;
        font-size: 13px;
        font-weight: 900;
        padding-left: 10px;
      }
      .ftime{
        .WarmPeriod{
          width: 100%;
          line-height: $s_height;
          span{
            font-size: 12px;
            display: inline-block;
            text-align: right;
            padding-right: 5px;
            width: $span_width;
            height: 100%;
          }
        }
        .ForesightPeriod{
          width: 100%;
          line-height: $s_height;
          span{
            font-size: 12px;
            display: inline-block;
            text-align: right;
            padding-right: 5px;
            width: $span_width;
            height: 100%;
          }
        }
        .time{
          width: 100%;
          line-height: $s_height;
          span{
            font-size: 12px;
            display: inline-block;
            text-align: right;
            padding-right: 5px;
            width: $span_width;
            height: 100%;
          }
        }
        .showButton{
          width: 100%;
          text-align: center;
          .show1{
            line-height: 27px;
            span{
              padding: 0 8px;
            }
          }
        }
        .sure{
          width: 100%;
          line-height: $s_height;
          text-align: center;
        }
      }
    }
    
  }
</style>
<style lang='scss'>
.Jobforecast {
  .el-input--small .el-input__inner{
    height: 25px;
    line-height: 25px;
  }
  .el-input__suffix{
    display: none;
  }
  .el-input__prefix{
    display:none;
  }
  .el-input--prefix .el-input__inner{
    padding-left:5px;
  }
  .el-input--suffix .el-input__inner{
    padding-right:5px;
  }
  .ivu-tree{
    padding: 10px 0 0 10px;
    li{
      margin: 0;
    }
  }
}
</style>

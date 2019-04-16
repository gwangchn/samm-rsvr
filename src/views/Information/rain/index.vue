<template>
  <div class="Rain">
    <oMap @showModal='showModal' @popRainData='popRainData'></oMap>
    <Maptool :sLive='sLive' :oType='`rain`' @lfchangeTimerain="lfchangeTime"></Maptool>
    <RightPanel>
      <all :style="style" slot="all"></all>
      <follow :style="style" slot="follow"></follow>
      <senior :style="style" slot="senior"></senior>
    </RightPanel>
    <Legend :legendList='legendList' :gap='gap'></Legend>
    <TimeBar :barwidth='barwidth' :passTime='passTimeBar' v-if='Hidetimebar' @passbarTime ='timebarT'></TimeBar>
    <Modal width="900"  v-model="modal1" :title="oModalName">
      <div class="modalBox">
        <div class="echartsBox">
          <div id="myChart"></div>
        </div>
        <div class="tableBox">
          <Table :columns="columns1" :height='340' :data="foreliveDetails"></Table>
        </div>
      </div>
    </Modal>
    <!-- 弹框 -->
    <div id="popRain" class="message-box">
      <header class="message-title">{{message.name}}</header>
      <div class="message-item">
        <span>{{message.drp}}mm</span>
      </div>
    </div>
    <TitleTime></TitleTime>
  </div>
</template>

<script>
import oMap from '@/map/maprain';
import Maptool from '@/components/Maptool';
import RightPanel from "@/components/RightPanel";
import Legend from '@/components/Legendrain';
import TitleTime from '@/components/TitleTime';
import all from './rightpanel/all';
import TimeBar from '@/components/TimeBar';
import follow from './rightpanel/follow';
import senior from './rightpanel/senior';
import echarts from 'echarts'
import {
  mapGetters, 
  mapMutations,
  mapActions
} from 'vuex'
export default {
  name: 'Rain',
  components:{
    oMap,
    Maptool,
    RightPanel,
    TimeBar,
    all,
    follow,
    senior,
    Legend,
    TitleTime
  },
  data() {
    return {
      sLive:true,
      passTimeBar:{},
      modal1:false,
      oModalName:'',
      columns1: [
        {
          title: '时间',
          key: 'ftm',
          align: 'center'
        },
        {
          title: '降水量(mm)',
          key: 'fpp',
          align: 'center'
        }
      ],
      message:{},
      legendList:[{
          num: "0.1-1.5",
          color: '#AAEC93'
        }, {
          num: "1.6-6.9",
          color: '#3BB73F'
        }, {
          num: "7.0-14.9",
          color: '#64B9F9'
        }, {
          num: "15-39.9",
          color: '#0302F8'
        }, {
          num: "40-49.9",
          color: '#F701F7'
        }, {
          num: "≥50",
          color: '#78073A'
        }]
    };
  },
  computed:{
    barwidth(){
      return 'calc(100vw - ' + (this.rPanelwidth + this.menuWidth) + 'px)'
    },
    style(){
      return {
        marginTop:10 + 'px'
      }
    },
    ...mapGetters(['rPanelwidth','menuWidth','Hidetimebar']),
    ...mapGetters('rain',['gap','startTm','endTm','foreliveDetails'])
  },
  watch: {
    foreliveDetails: {
      deep: true,
      handler(val) {
        this.init(val);
      }
    }
  },
  mounted(){
    this.CHANGE_TYPE('S');
    this.getListData([this,this.sameTime()]);
    this.getIsosurfaceLine([this,this.sameTime()]);
    //标题时间 名称
    this.SET_COMMONTITLE('实时降雨量');
    let nowTime = new Date().formatDate('yyyy-MM-dd 08');
    this.SET_TITLETIME(nowTime);
    this.SET_HIDETITLETIME(true);
  },
  methods:{
    showModal(obj){
      let {startTm,endTm} = this;
      this.modal1 = true;
      this.oModalName = `${obj.stnm}降雨过程 （${startTm} ~ ${endTm}）`;
    },
    popRainData(obj){
      this.message = obj;
    },
    //初始化表格
    init(data) {
      let xAxis = [],yAxis=[];
      data.map(x=>{
        xAxis.push(x.ftm);
        yAxis.push(x.fpp);
      })
      let myChart = echarts.init(document.getElementById('myChart'));
      let option = {
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top:'2%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : xAxis,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'降雨量(mm)',
                type:'bar',
                barWidth: '15%',
                data:yAxis
            }
        ]
    }
      myChart.setOption(option);
    },
    lfchangeTime(obj){
      this.CHANGE_GAP(obj.value);
      this.CHANGE_TYPE(obj.type);
      if(obj.type == 'Y'){
        this.passTimeBar = obj;
        //标题时间 名称
        this.SET_COMMONTITLE('预报降雨量');
      }else{
        this.$eventBus.$emit('passLatticeRain',[]);//清空地图上的格点雨量
        this.getListData([this,this.sameTime()]);
        this.getIsosurfaceLine([this,this.sameTime()]);
        //标题时间 名称
        this.SET_COMMONTITLE('实时降雨量');
        let nowTime = new Date(this.sameTime().startDate).formatDate('yyyy-MM-dd HH');
        this.SET_TITLETIME(nowTime);
      }
    },
    //timebar上时间点的时间
    timebarT(value){
      let {gap} = this;
      let startDate =  `${value}:00:00`;
      let endDate =  startDate.toDate().datePro(`{%H+${gap}}`).formatDate('yyyy-MM-dd HH:00:00');
      this.CHANGE_STARTTM(startDate);
      this.CHANGE_ENDTM(endDate);
      this.getListData([this,{
        startDate:startDate,
        endDate:endDate
      }]);
      this.getIsosurfaceLine([this,{
        startDate:startDate,
        endDate:endDate
      }]);
      //点击时间轴调用格点雨量
      this.getLatticerainfall(this);
      //标题时间 
      this.SET_TITLETIME(`${value}`);
    },
    sameTime(){
      let {gap} = this;
      let now = new Date();
      let endDate =  now.formatDate('yyyy-MM-dd 08:00:00');
      let startDate =endDate.toDate().datePro(`{%H-${gap}}`).formatDate('yyyy-MM-dd HH:00:00');
      this.CHANGE_STARTTM(startDate);
      this.CHANGE_ENDTM(endDate);
      return {
        startDate:startDate,
        endDate:endDate
      }
    },
    ...mapMutations(['SET_COMMONTITLE','SET_TITLETIME','SET_HIDETITLETIME']),
    ...mapMutations('rain',['CHANGE_GAP','CHANGE_STARTTM','CHANGE_ENDTM','CHANGE_TYPE']),
    ...mapActions('rain',['getListData','getLatticerainfall','getIsosurfaceLine'])
  }
}
</script>

<style scoped lang="scss">
$margin: 350px;
.modalBox{
    height: $margin;
    .echartsBox{
      width: 70%;
      height: $margin;
      float: left;
      #myChart{
        width: 600px;
        height: $margin;
      }
    }
    .tableBox{
      width: 260px;
      height: $margin;
      float: left;
    }
  }
.Rain{
  .message-box {
    font-size: 12px;
    color: white;
    padding: 0 10px;
    height: 55px;
    background-color:$opop-color;
    border-radius: 0 5px 5px 5px;
    box-shadow:1px 1px 5px #222;
    padding: 8px;
    line-height: 20px;
    &::before {
      content: '';
      width: 0;
      height: 0;
      display: block;
      border-top: 10px solid white;
      border-right: 10px solid transparent;
      position: absolute;
      top: 0;
      left: 0;
    }
    .message-title {
      font-size: 14px;
      font-weight: 900;
    }
  }
}
  
</style>

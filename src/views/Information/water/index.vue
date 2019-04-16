
<template>
  <div class="Water">
    <oMap @showModal='showModal' @popWaterData='popWaterData'></oMap>
    <Maptool  @lfchangeTimewater="lfchangeTime" ></Maptool>
    <RightPanel>
      <all :style="style" slot="all"></all>
      <follow :style="style" slot="follow"></follow>
      <senior :style="style" slot="senior"></senior>
    </RightPanel>
    <TimeBar :barwidth='barwidth' :passTime='passTimeBar' v-show="Hidetimebar" @passbarTime ='timebarT'></TimeBar>
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
    <div id="popWater" class="message-box">
      <header class="message-title">{{message.name}}</header>
      <div class="message-item">
        <span>水位:</span>
        <span>{{message.z}}(m)</span>
      </div>
      <div v-show="RR">
        <div class="message-item">
          <span>入流:</span>
          <span>{{message.inq}}(m³/s)</span>
        </div>
        <div class="message-item">
          <span>出流:</span>
          <span>{{message.otq}}(m³/s)</span>
        </div>
      </div>
      <div v-show="ZZ">
        <div class="message-item">
          <span>流量:</span>
          <span>{{message.inq}}(m³/s)</span>
        </div>
      </div>
    </div>
    <TitleTime></TitleTime>
  </div>
</template>

<script>
import oMap from '@/map/mapwater';
import Maptool from '@/components/Maptoolw';
import RightPanel from '@/components/RightPanel';
import TimeBar from '@/components/TimeBar';
import all from './rightPanel/all';
import follow from './rightPanel/follow';
import senior from './rightPanel/senior';
import echarts from 'echarts';
import TitleTime from '@/components/TitleTime';
import {
  mapGetters,
  mapMutations, 
  mapActions
} from 'vuex'
export default {
  name: 'Water',
  components:{
    oMap,
    Maptool,
    RightPanel,
    TimeBar,
    all,
    follow,
    senior,
    TitleTime
  },
  data() {
    return {
      passTimeBar:{},
      modal1:false,
      oModalName:'',
      columns1: [{
          title: '时间',
          key: 'tm',
          align: 'center'
        },
        {
          title: '入库流量(m³/s)',
          key: 'inq',
          align: "center"
        }
      ],
      message:{},
      RR:false,
      ZZ:false
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
    ...mapGetters('water',['startTm','endTm','foreliveDetails'])
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
    //标题时间 名称
    this.SET_COMMONTITLE('水库实时水情');
    let nowTime = new Date().formatDate('yyyy-MM-dd 08');
    this.SET_TITLETIME(nowTime);
    this.SET_HIDETITLETIME(true);
  },
  methods:{
    showModal(obj){
      let {startTm,endTm} = this;
      this.modal1 = true;
      this.oModalName = `${obj.stnm.trim()}流量过程 （${startTm} ~ ${endTm}）`;
    },
    popWaterData(obj){
      if(obj.sttp == 'RR'){
        this.RR = true;
        this.ZZ = false;
      }else{
        this.ZZ = true;
        this.RR = false;
      }
      this.message = obj;
    },
    //初始化表格
    init(data) {
      let xAxis = [],yAxis=[];
      data.map(x=>{
        xAxis.push(x.tm);
        yAxis.push(x.inq);
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
                name:'入库流量(m³/s)',
                type:'line',
                barWidth: '15%',
                data:yAxis
            }
        ]
    };
      myChart.setOption(option, true);
    },
    lfchangeTime(obj){
      this.CHANGE_TYPE(obj);
      if(obj == 'Y'){
        this.passTimeBar = {value:1};
        this.SET_COMMONTITLE('水库预报水情');
      }else{
        this.getListData([this,this.sameTime()]);
        let nowTime = new Date().formatDate('yyyy-MM-dd 08');
        this.SET_TITLETIME(nowTime);
        this.SET_COMMONTITLE('水库实时水情');
      }
    },
    //timebar上时间点的时间
    timebarT(value){
      let startDate =  `${value}:00:00`;
      let endDate =  startDate.toDate().datePro(`{%H+1}`).formatDate('yyyy-MM-dd HH:00:00');
      this.CHANGE_STARTTM(startDate);
      this.CHANGE_ENDTM(endDate);
      this.getListData([this,{
        startDate:startDate,
        endDate:endDate
      }]);
      //标题时间 
      this.SET_TITLETIME(`${value}`);
    },
    sameTime(){
      let now = new Date();
      let endDate= now.formatDate('yyyy-MM-dd 08:00:00')
      let startDate = now.formatDate('yyyy-MM-dd 08:00:00').toDate().datePro(`{%d-7}`).formatDate('yyyy-MM-dd 08:00:00')
      this.CHANGE_STARTTM(startDate);
      this.CHANGE_ENDTM(endDate);
      return {
        startDate:startDate,
        endDate:endDate
      }
    },
    ...mapMutations('water',['CHANGE_STARTTM','CHANGE_ENDTM','CHANGE_TYPE']),
    ...mapActions('water',['getListData']),
    ...mapMutations(['SET_COMMONTITLE','SET_TITLETIME','SET_HIDETITLETIME'])
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
.Water {
  .message-box {
    font-size: 12px;
    color: white;
    padding: 0 10px;
    height: 90px;
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

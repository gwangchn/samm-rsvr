<template>
  <div class="warning">
    <oMap @popWarningData='popWarningData' @showWarnDetails='showDetails'></oMap>
    <Maptool @lfchangeTimewarning='lfchangeTime' :oType='`warning`'></Maptool>
    <RightPanel>
      <all :style="style" slot="all"></all>
      <follow :style="style" slot="follow"></follow>
      <senior :style="style" slot="senior"></senior>
    </RightPanel>
    <Legend :legendList='legendList'></Legend>
    <warnnum></warnnum>
    <res-detail></res-detail>
    <!-- 弹框 -->
    <div id="popWarning" class="message-box">
      <header class="message-title">{{message.name}}</header>
      <div class="message-item">
        <span>{{message.ftm}}</span>
      </div>
      <div class="message-item">
        <span>水位:</span>
        <span>{{message.z}}(m)</span>
      </div>
      <div class="message-item">
        <span>入流:</span>
        <span>{{message.inq}}(m³/s)</span>
      </div>
      <div class="message-item">
        <span>出流:</span>
        <span>{{message.otq}}(m³/s)</span>
      </div>
      <div class="message-item">
        <span>超告警水位:</span>
        <span>{{message.warn}}(m)</span>
      </div>
    </div>
    <TitleTime></TitleTime>
  </div>
</template>

<script>
import oMap from '@/map/mapwarn';
import Maptool from '@/components/Maptoold';
import Legend from '@/components/Legend';
import RightPanel from "@/components/RightPanel";
import all from './rightPanel/all';
import follow from './rightPanel/follow';
import senior from './rightPanel/senior';
import warnnum from './warnnum';
import resDetail from '@/components/res-detail';
import TitleTime from '@/components/TitleTime';
import {
  mapGetters, 
  mapMutations,
  mapActions
} from 'vuex'
export default {
  name: 'warning',
  components:{
    oMap,
    Maptool,
    Legend,
    RightPanel,
    all,
    follow,
    senior,
    warnnum,
    resDetail,
    TitleTime
  },
  data() {
    return {
      sLive:false,
      message:{},
      legendList:[
        {
          name:'漫顶',
          src:'img/red.png'
        },
        {
          name:'超设计',
          src:'img/gold.png'
        },
        {
          name:'超汛限',
          src:'img/blue.png'
        }
      ]
    };
  },
  computed:{
    style(){
      return {
        marginTop:10 + 'px'
      }
    },
    ...mapGetters('warning',['type'])
  },
  mounted(){
    this.sameTime();
    this.CHANGE_TYPE('S');
    this.getWarnListData(this);
    this.getWarnNum(this);
    //标题时间 名称
    this.SET_COMMONTITLE('水库实时告警');
    let nowTime = new Date().formatDate('yyyy-MM-dd 08');
    this.SET_TITLETIME(nowTime);
    this.SET_HIDETITLETIME(true);
  },
  methods:{
    popWarningData(value){//地图划过点显示
      this.message = value;
    },
    showDetails(attribute){//点击地图上的点
      this.$eventBus.$emit('passResdetail',attribute);
    },
    lfchangeTime(value){
      if(value == 'S'){
        this.sameTime();
        this.CHANGE_TYPE('S');
        this.getWarnListData(this);
        this.getWarnNum(this);
        //标题名称
        this.SET_COMMONTITLE('水库实时告警');
      }else{
        let now = new Date();
        let startDate= now.formatDate('yyyy-MM-dd 08:00:00')
        let endDate =  now.datePro(`{%d+7}`).formatDate('yyyy-MM-dd 08:00:00');
        this.CHANGE_STARTTM(startDate);
        this.CHANGE_ENDTM(endDate);
        this.CHANGE_TYPE('Y');
        this.getWarnListData(this);
        this.getWarnNum(this);
        //标题名称
        this.SET_COMMONTITLE('水库预报告警');
      }
    },
    sameTime(){
      let now = new Date();
      let endDate= now.formatDate('yyyy-MM-dd 08:00:00')
      let startDate = now.formatDate('yyyy-MM-dd 08:00:00').toDate().datePro(`{%d-7}`).formatDate('yyyy-MM-dd 08:00:00')
      this.CHANGE_STARTTM(startDate);
      this.CHANGE_ENDTM(endDate);
    },
    ...mapMutations('warning',['CHANGE_TYPE','CHANGE_STARTTM','CHANGE_ENDTM']),
    ...mapActions('warning',['getWarnListData','getWarnNum']),
    ...mapMutations(['SET_COMMONTITLE','SET_TITLETIME','SET_HIDETITLETIME'])
  }
}
</script>

<style scoped lang="scss">
.warning{
  .message-box {
    font-size: 12px;
    color: white;
    padding: 0 10px;
    height: 135px;
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
    .message-item {
      // display: flex;
      // justify-content: space-between;
    }
  }
}
</style>

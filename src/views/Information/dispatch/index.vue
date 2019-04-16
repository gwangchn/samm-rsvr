
<template>
  <div class="dispatch">
    <oMap @popDispatchData='popDispatchData' @showDispatchDetails='showDetails'></oMap>
    <Maptool @lfchangeTimedispatch='lfchangeTime' :oType='`dispatch`'></Maptool>
    <RightPanel>
      <all :style="style" slot="all"></all>
      <follow :style="style" slot="follow"></follow>
      <senior :style="style" slot="senior"></senior>
    </RightPanel>
    <Legend :legendList='legendList'></Legend>
    <res-detail></res-detail>
    <!-- 弹框 -->
    <div id="popDispatch" class="message-box">
      <header class="message-title">{{message.name}}</header>
      <div class="message-item">
        <span>水位:</span>
        <span>{{message.rz}}(m)</span>
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
        <span>超汛限:</span>
        <span>{{message.warnrz}}(m)</span>
      </div>
    </div>
    <TitleTime></TitleTime>
  </div>
</template>

<script>
import oMap from '@/map/mapdispatch';
import Maptool from '@/components/Maptoold';
import Legend from '@/components/Legend';
import RightPanel from '@/components/RightPanel';
import all from './rightPanel/all';
import follow from './rightPanel/follow';
import senior from './rightPanel/senior';
import resDetail from '@/components/res-detail';
import TitleTime from '@/components/TitleTime';
import {
  mapGetters, 
  mapMutations,
  mapActions
} from 'vuex'
export default {
  name: 'Dispatch',
  components:{
    oMap,
    Maptool,
    RightPanel,
    all,
    follow,
    senior,
    Legend,
    resDetail,
    TitleTime
  },
  data() {
    return {
      message:{},
      legendList:[
        {
          name:'水库(实时)',
          src:'img/ssleg.png'
        },
        {
          name:'水库(预报)',
          src:'img/ybleg.png'
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
    ...mapGetters('dispatch',['type'])
  },
  mounted(){
    this.CHANGE_TYPE('S');
    this.sameTime();
    this.getDispatchListData(this);
    //标题时间 名称
    this.SET_COMMONTITLE('水库调度');
    let nowTime = new Date().formatDate('yyyy-MM-dd 08');
    this.SET_TITLETIME(nowTime);
    this.SET_HIDETITLETIME(false);
  },
  methods:{
    popDispatchData(obj){//地图划过点显示
      let {type} = this;
      if(type == 'S'){
        this.message = {
          name: obj.ennm,
          rz : obj.rz,
          inq : obj.inq,
          otq : obj.otq,
          warnrz : obj.warnrz
        }
      }else{
        this.message = {
          name: obj.ennm,
          rz : obj.frz,
          inq : obj.finq,
          otq : obj.fotq,
          warnrz : obj.warnfrz
        }
      }
    },
    showDetails(attribute){//点击地图上的点
      this.$eventBus.$emit('passResdetail',attribute);
    },
    lfchangeTime(value){
      if(value == 'S'){
        this.sameTime();
        this.CHANGE_TYPE('S');
        this.getDispatchListData(this);
      }else{
        let now = new Date();
        let startDate= now.formatDate('yyyy-MM-dd 08:00:00')
        let endDate =  now.datePro(`{%d+7}`).formatDate('yyyy-MM-dd 08:00:00');
        this.CHANGE_STARTTM(startDate);
        this.CHANGE_ENDTM(endDate);
        this.CHANGE_TYPE('Y');
        this.getDispatchListData(this);
      }
    },
    sameTime(){
      let now = new Date();
      let endDate= now.formatDate('yyyy-MM-dd 08:00:00')
      let startDate = now.formatDate('yyyy-MM-dd 08:00:00').toDate().datePro(`{%d-7}`).formatDate('yyyy-MM-dd 08:00:00')
      this.CHANGE_STARTTM(startDate);
      this.CHANGE_ENDTM(endDate);
    },
    ...mapMutations('dispatch',['CHANGE_TYPE','CHANGE_STARTTM','CHANGE_ENDTM']),
    ...mapActions('dispatch',['getDispatchListData']),
    ...mapMutations(['SET_COMMONTITLE','SET_TITLETIME','SET_HIDETITLETIME'])
  }
}
</script>

<style scoped lang="scss">
.dispatch{
  .message-box {
    font-size: 12px;
    color: white;
    padding: 0 10px;
    height: 115px;
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

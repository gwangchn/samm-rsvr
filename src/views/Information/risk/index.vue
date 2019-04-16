
<template>
  <div class="risk">
    <oMap @popRiskData='popRiskData' @showRiskDetails='showDetails'></oMap>
    <Maptool :sLive='sLive'></Maptool>
    <RightPanel>
      <all :style="style" slot="all"></all>
      <follow :style="style" slot="follow"></follow>
      <senior :style="style" slot="senior"></senior>
    </RightPanel>
    <res-detail></res-detail>
    <!-- 弹框 -->
    <div id="popRisk" class="message-box">
      <header class="message-title">{{message.name}}</header>
      <div class="message-item">
        <span>10年一遇洪水:</span>
      </div>
      <div class="message-item">
        <span>下泄流量:</span>
        <span>{{message.bwq1}}(m³/s)</span>
      </div>
      <div class="message-item">
        <span>淹没面积:</span>
        <span>{{message.rsarea1}}(km²)</span>
      </div>
      <div class="message-item">
        <span>溃坝洪水:</span>
      </div>
      <div class="message-item">
        <span>下泄流量:</span>
        <span>{{message.bwq}}(m³/s)</span>
      </div>
      <div class="message-item">
        <span>淹没面积:</span>
        <span>{{message.rsarea}}(km²)</span>
      </div>
    </div>
    <TitleTime></TitleTime>
  </div>
</template>

<script>
import oMap from '@/map/maprisk';
import Maptool from '@/components/Maptool';
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
  name: 'Risk',
  components:{
    oMap,
    Maptool,
    RightPanel,
    all,
    follow,
    senior,
    resDetail,
    TitleTime
  },
  data() {
    return {
      sLive:false,
      message:{}
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
    ...mapGetters(['rPanelwidth','menuWidth','Hidetimebar'])
  },
  mounted(){
    this.getRiskList(this);
    //标题时间 名称
    this.SET_COMMONTITLE('溃坝洪水风险图');
    let nowTime = new Date().formatDate('yyyy-MM-dd 08');
    this.SET_TITLETIME(nowTime);
    this.SET_HIDETITLETIME(false);
  },
  methods:{
    popRiskData(obj){//地图划过点显示
      this.message = {
        name : obj.ennm.trim(),
        bwq: obj.bwq,
        bwq1: obj.bwq1,
        rsarea: obj.rsarea,
        rsarea1: obj.rsarea1
      }
    },
    showDetails(attribute){//点击地图上的点
      this.$eventBus.$emit('passResdetail',attribute);
    },
    ...mapActions('risk',['getRiskList']),
    ...mapMutations(['SET_COMMONTITLE','SET_TITLETIME','SET_HIDETITLETIME'])
  }
}
</script>

<style scoped lang="scss">
.risk{
  .message-box {
    font-size: 12px;
    color: white;
    padding: 0 10px;
    height: 150px;
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

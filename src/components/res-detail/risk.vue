<template>
  <div class="common-resDetail-risk">
    <item-box name="风险" :list="list" @onSelect="onSelect" :isShadow="false">
      <div class="content">
        <oMap v-if="showFlag" @showDetail='showDetail'></oMap>
        <riskexplain></riskexplain>
        <Maptool></Maptool>
      </div>
    </item-box>
    <Modal width="700"  v-model="modal1" :title="oSectionName">
      <div class="sectionModalBox">
        <div class="rightTableT">
          <div>
            <p>最高水位(m)</p>
            <p class="HH">{{hz}}</p>
          </div>
          <div style="border-right: none;">
            <p>最大流量(m3/s)</p>
            <p class="HH">{{hq}}</p>
          </div>
        </div>
        <div class="echartsBox">
          <div id="myChart"></div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import oMap from '@/map/mapdetail'
import echarts from 'echarts'
import Maptool from '@/components/MaptoolDetail'
import riskexplain from './riskexplain'
import itemBox from '@/views/Information/overview/components/item-boxR'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    itemBox,
    oMap,
    riskexplain,
    Maptool
  },
  data () {
    return {
      list: [
        { text: '溃坝洪水', value: 'K' },
        { text: '10年一遇洪水', value: 'S' }
      ],
      type:'K',
      modal1:false,
      sLive:false,
      hz:'',
      hq:''
    }
  },
  computed:{
    ... mapGetters('resDetail', ['showFlag','sectionList','oSectionName','sectionExplain','ennmcd'])
  },
  mounted() {
    this.$eventBus.$on('passResdetail', res => {
      let ennmcd = res.ennmcd;
      this.CHANGE_ENNMCD(ennmcd);
      this.init();
    })
    this.$eventBus.$on('showSection', x => {
      this.modal1 = x;
    })
  },
  watch: {
    sectionList: {
      deep: true,
      handler(val) {
        this.initEcharts(val);
      }
    }
  },
  methods: {
    onSelect(value) {
      this.type = value.value;
      this.init();
    },
    init(){
      let {type,ennmcd} = this;
      let params ={
        ennmcd:ennmcd,
        rvsanalyflage: type
      };
      this.getcrossSection([this,params]);
      this.getrsvrExplain([this,params]);
      this.getArea([this, params])
    },
    showDetail(val){
      let {cid,rscd,z,q} = val;
      this.getriverDetail([this,{
        cid:cid,
        rscd:rscd
      }]);
      this.CHANGE_OSECTIONNAME(`断面${rscd}详情`);
      this.hz =  this.$util.convertZ(z);
      this.hq =  this.$util.convertQ(q);
    },
    //初始化表格
    initEcharts(data) {
      let self = this;
      let {oSectionName} = this;
      let xAxis = [],
        yAxis = [],
        oZ = [],
        oY = "";
      data.map(x => {
        xAxis.push(x.ptno);
        yAxis.push(self.$util.convertZ(x.amel));
        oZ.push(self.$util.convertZ(x.z));//有问题
      });
      oY = Math.min.apply(null, yAxis);
      let myChart = echarts.init(document.getElementById('myChart'));
      let option ={
        title: {
            text: "最高水位示意图",
            textStyle: {
              color: "#666666",
              fontSize: "14"
            },
            top: 5,
            left: 10
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [{
            type: "category",
            boundaryGap: false,
            data: xAxis
          }],
          yAxis: [{
            type: "value",
            min: oY
          }],
          series: [{
              name: "水位",
              type: "line",
              areaStyle: {
                normal: {}
              },
              itemStyle: {
                normal: {
                  barBorderColor: "#0B73C7",
                  color: "#3DA9FF"
                },
                emphasis: {
                  color: "#0B73C7"
                }
              },
              data: oZ
            },
            {
              name: "高程",
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              itemStyle: {
                normal: {
                  barBorderColor: "#722f2f",
                  color: "#722f2f"
                },
                emphasis: {
                  color: "#722f2f"
                }
              },
              data: yAxis
            }
          ]
      }
      myChart.setOption(option);
    },
    ...mapMutations('resDetail',['CHANGE_OSECTIONNAME','CHANGE_ENNMCD']),
    ...mapActions('resDetail',['getcrossSection','getriverDetail','getrsvrExplain', 'getArea'])
  },
  beforeDestroy(){
    this.$eventBus.$off('passResdetail');
  }
}
</script>

<style lang="scss">
.common-resDetail-risk {
  .content {
    width: 868px;
    height: 400px;
  }
} 
</style>
<style lang="scss" scoped>
  $margin: 370px;
  .sectionModalBox{
    height: $margin;
    .rightTableT {
      height: 60px;
      width: 100%;
      background: #f6f6f5;
      margin: 10px 0;

      div {
        float: left;
        width: 50%;
        height: 100%;
        text-align: center;
        line-height: 30px;
        border-right: 1px solid #ededed;

        p {
          font-size: 18px;
        }

        .HH {
          font-size: 22px;
          font-weight: 900;
        }
      }
    }
    .echartsBox{
      width: 100%;
      height: 300px;
      float: left;
      #myChart{
        width: 670px;
        height: 300px;
      }
    }
  }
</style>

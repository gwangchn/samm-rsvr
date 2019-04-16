<template>
  <div class="explain">
    <div class="explainT">
      <div class="title">说明</div>
      <div class="floodLevel">洪水级别:{{floodLevel}}</div>
      <div>
        <span>最大泄流:{{bwq}}m³/s</span>
        <span>淹没面积:{{rsarea}}km²</span>
      </div>
    </div>
    <div class="explainC">
      <div class="title">水面线</div>
      <div id="explainChart"></div>
    </div>
    <div class="explainB">
      <div class="title">图例</div>
      <div class="legend">
        <div class="legendW">
          <ul>
            <li v-for="(item,index) in items" :key="index">
              <span :style="{background:item.color }" class="legendColor"></span>
              <span>{{item.num}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import echarts from "echarts";
export default {
  name: 'riskexplain',
  components: {},
  data () {
    return {
      floodLevel:'',
      bwq:'',
      rsarea:''
    }
  },
  computed: {
    items() {
      let arr = [{
        num: "0 - 0.5",
        color: 'rgba(230, 255, 255,1)'
      }, {
        num: "0.5 - 1",
        color: 'rgba(110, 255, 255,1)'
      }, {
        num: "1 - 1.5",
        color: 'rgba(0, 230, 230,1)'
      }, {
        num: "1.5 - 2.5",
        color: 'rgba(0, 191, 191,1)'
      }, {
        num: "2.5 - 5",
        color: 'rgba(0, 147, 217,1)'
      }, {
        num: "≥ 5",
        color: 'rgba(0, 80, 170,1)'
      }]
      return arr
    },
    ... mapGetters('resDetail', ['sectionExplain'])
  },
  watch: {
    sectionExplain: {
      deep: true,
      handler(val) {
        let value = val[0] == undefined ? {} : val[0];
        this.floodLevel = value.cnm;
        this.bwq = this.$util.convertQ(value.bwq);
        this.rsarea = parseFloat(value.rsarea).toFixed(1);
        
      }
    }
  },
  mounted() {
    this.$eventBus.$on('explainDetail',data=>{
      this.initEcharts(data);
    });
  },
  methods: {
    initEcharts(data) {
      let self = this;
      let xAxis = [],
        elevation = [],
        waterLevel = [],
        minY = [];
      data.map((x) => {
        xAxis.push(x.rscd);
        elevation.push(self.$util.convertZ(x.amel));
        waterLevel.push(self.$util.convertZ(x.z));
      });
      minY = Math.min.apply(null, elevation);
      let myChart = echarts.init(document.getElementById('explainChart'));
      let option ={
        // title: {
        //   text: "水面线过程示意图",
        //   top: 15,
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#505765'
            }
          }
        },
        grid: {
          top:'30px',
          left: "-10px",
          right: "25px",
          bottom: "1%",
          containLabel: true
        },
        xAxis: [{
          type: "category",
          boundaryGap: false,
          data: xAxis
        }],
        yAxis: [{
          name: "水位(m)",
          type: "value",
          min: minY
        }, {
          name: "高程(m)",
          type: "value"
        }],
        series: [{
          name: "水位",
          type: "line",
          areaStyle: {},
          itemStyle: {
            normal: {
              barBorderColor: "#3DA9FF",
              color: "#3DA9FF"
            }
          },
          data: waterLevel
        }, {
          name: "高程",
          type: "line",
          areaStyle: {},
          itemStyle: {
            normal: {
              barBorderColor: "#722f2f",
              color: "#722f2f"
            }
          },
          data: elevation
        }]
      }
      myChart.setOption(option);
    },
    ...mapMutations('resDetail', ['CHANGE_ENNMCD', 'CHANGE_SHOWFLAG']),
    ...mapActions('resDetail', ['getInfo', 'getRainfall'])
  },
  beforeDestroy() {
    this.$eventBus.$off('explainDetail');
  }
}
</script>

<style lang="scss" scoped>
  $width:200px;
  .explain{
    width: $width;
    height: 300px;
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    background: rgba($color: #fff, $alpha: 0.9);
    border-top-right-radius: 5px;
    .title{
      line-height: 25px;
      width: 100%;
      padding-left: 5px;
      font-weight: 900;
      font-size: 13px;
    }
    .explainT{
      height: 70px;
      width: 100%;
      border-bottom: 1px solid #222;
      .floodLevel{
        line-height: 15px;
        padding-left: 10px;
      }
      span{
        width: 100%;
        display: block;
        padding-left: 10px;
        line-height: 15px;
      }
    }
    .explainC{
      height: 140px;
      width: 100%;
      border-bottom: 1px solid #222;
      #explainChart{
        height: 110px;
        width: $width;
      }
    }
    .explainB{
      height: 90px;
      width: 100%;
      .legend{
        height: 60px;
        width: 100%;
        .legendW{
          height: 100%;
          li{
            float: left;
            width: 50%;
            line-height: 20px;
            .legendColor{
              height: 10px;
              width: 10px;
              margin: 0 10px;
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>


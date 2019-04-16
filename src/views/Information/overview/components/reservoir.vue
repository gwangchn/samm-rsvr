<template>
  <item-box :name="name">
    <div class="chart-wrap">
      <div class="chart" ref="chart"></div>
      <div class="res-box"></div>
      <div class="time-box">
        <span v-for="(item, index) in dateArr"
              :key="`date${index}`">{{item}}</span>
      </div>
    </div>
  </item-box>
</template>

<script>
import itemBox from './item-box'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'
import { getWarnLine, getWaterLevel } from '@/api/information/overview'
import { mapGetters } from 'vuex'

let userinfo = JSON.parse(sessionStorage.getItem('samm-userinfo'))
export default {
  components: {
    itemBox
  },
  data () {
    return {
      name: '水库',
      chart: null,
      dateArr: []
    }
  },
  computed: mapGetters('overview', ['focusRes']),
  mounted () {
    let now = new Date()

    this.setTimebar(now)
    this.chart = echarts.init(this.$refs.chart)
    this.__resizeHanlder = this.$util.debounce(() => {
      let { chart } = this
      chart && chart.resize()
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  destroyed () {
    window.removeEventListener('resize', this.__resizeHanlder)
  },
  watch: {
    focusRes(value) {
      if (!value) return
      this.handleChart(value)
    }
  },
  methods: {
    setOptions(data, { realZ, foreZ, overZ }) {
      let arrX = []
      let arrY = []
      data.forEach(({ tm, rz }) => {
        arrX.push(tm)
        arrY.push(rz)
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          // formatter: arr => {
          //   let item = arr[0]
          //   let colorIcon = color => `<span style="display:inline-block;
          //                                          margin-right:5px;
          //                                          border-radius:10px;
          //                                          width:10px;
          //                                          height:10px;
          //                                          background-color:${color};"></span>`
          //   let realStr = realZ === null ? '' : `${colorIcon('blue')}超汛限水位：${realZ}m<br/>`
          //   let foreStr = foreZ === null ? '' : `${colorIcon('gold')}超设计水位：${foreZ}m<br/>`
          //   let overStr = overZ === null ? '' : `${colorIcon('red')}漫顶水位：${overZ}m<br/>`
          //   return `${item.axisValue}<br/>
          //           ${item.marker}${item.seriesName}：${this.$util.convertZ(item.value)}m<br/>
          //           ${realStr}
          //           ${foreStr}
          //           ${overStr}`
          // }
        },
        color: '#3DA9FF',
        grid: {
          left: 0,
          right: 50,
          bottom: 20,
          top: 0,
          containLabel: false
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false,
          data: arrX
        },
        yAxis: {
          type: 'value',
          show: false,
          splitLine: {
            show: false
          },
          max({ max }) {
            let arr = [max, realZ, foreZ, overZ]
            return Math.max(...arr) + 40
          },
          min({ min }) {
            let arr = [min, realZ, foreZ, overZ]
            let minValue = Math.min(...arr) - 40
            return minValue < 0 ? 0 : minValue
          }
        },
        series: [{
          name: "水位",
          smooth: true,
          data: arrY,
          type: 'line',
          areaStyle: {},
          markLine: {
            name: "当前",
            symbolSize: 0,
            label: {
              position: "middle",
              formatter: function (value) {
                return value.name
              }
            },
            data: [
              {
                name: `汛限水位:${realZ}m`,
                yAxis: realZ,
                lineStyle: {
                  color: "blue",
                  width: 1.5,
                  type: "solid",
                  opacity: realZ === 0 ? 0 : 1
                },
                label: {
                  show: realZ === 0 ? false : true
                }
              },
              {
                name: `设计水位:${foreZ}m`,
                yAxis: foreZ,
                lineStyle: {
                  color: "gold",
                  width: 1.5,
                  type: "solid",
                  opacity: foreZ === 0 ? 0 : 1
                },
                label: {
                  show: foreZ === 0 ? false : true
                }
              },
              {
                name: `漫顶水位:${overZ}m`,
                yAxis: overZ,
                lineStyle: {
                  color: "red",
                  width: 1.5,
                  type: "solid",
                  opacity: overZ === 0 ? 0 : 1
                },
                label: {
                  show: overZ === 0 ? false : true
                }
              }
            ]
          }
        }]
      }, true)
    },
    setTimebar(now) {
      let arr = []
      for (let i = 3; i > 0; i--) {
        arr.push(new Date(now).datePro(`{%d-${i}}`).formatDate('dd日'))
      }
      arr.push('实时')
      for (let i = 1; i < 8; i++) {
        arr.push(new Date(now).datePro(`{%d+${i}}`).formatDate('dd日'))
      }
      this.dateArr = arr
    },
    async handleChart(item) {
      let now = new Date()
      let ennmcd = item.ennmcd
      
      this.name = item.ennm
      this.setTimebar(now)

      let res = await Promise.all([
        getWarnLine(ennmcd),
        getWaterLevel({
          ennmcd,
          startDate: new Date(now).datePro('{%d-3}').formatDate('yyyy-MM-dd 08:00:00'),
          endDate: new Date(now).datePro('{%d+7}').formatDate('yyyy-MM-dd 08:00:00')
        })
      ])
      let resZ = res[0].data.result
      let resData = res[1].data.result
      let realZ = 0
      let foreZ = 0
      let overZ = 0
      
      // resZ.forEach(value => {
      //   if (value.warntypeid === 1) {
      //     realZ = this.$util.convertZ(value.mrz)
      //   }
      //   if (value.warntypeid === 2) {
      //     foreZ = this.$util.convertZ(value.mrz)
      //   }
      //   if (value.warntypeid === 3) {
      //     overZ = this.$util.convertZ(value.mrz)
      //   }
      // })
      if (resZ.length !== 0) {
        let { damel, dsflz, mrz } = resZ[0]
        realZ = mrz
        foreZ = dsflz
        overZ = damel
      }

      this.setOptions(resData, {
        realZ,
        foreZ,
        overZ
      })
    }
  }
}
</script>

<style scoped lang="scss">
$margin: 10px;

.chart-wrap {
  display: flex;
  height: 100%;
  position: relative;
}
.chart {
  flex: 1;
  margin: $margin;
}
.res-box {
  width: 50px;
  background: url("~@/assets/overview/res.png");
  background-size: 100% 100%;
  height: calc(100% - #{$margin} *2);
  position: absolute;
  right: $margin;
  top: $margin;
}
.time-box {
  height: 20px;
  width: calc(100% - #{$margin} *2 - 50px);
  position: absolute;
  left: $margin;
  bottom: $margin;
  line-height: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
}
</style>

<template>
  <div class="common-resDetail-rain">
    <item-box name="雨洪"
              :list="listData"
              @onSelect="onSelect"
              :isShadow="false">
      <Tabs ref="tabs">
        <TabPane label="图表">
          <div class="chart-content">
            <div class="chart" ref="chart"></div>
            <!-- <div class="res-box"></div> -->
          </div>
        </TabPane>
        <TabPane label="列表">
          <Table :columns="columns" :data="data" height="400"></Table>
        </TabPane>
      </Tabs>
    </item-box>
  </div>
</template>

<script>
import itemBox from '@/views/Information/overview/components/item-box'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/theme/macarons'
import { mapGetters } from 'vuex'

export default {
  components: {
    itemBox
  },
  data () {
    return {
      listData: [
        { text: '图表', value: 0 },
        { text: '列表', value: 1 }
      ],
      columns: [
        {
          title: '时间',
          align:'center',
          render: (h, params) => {
            return h('span', params.row.ftm.substring(5, 13))
          }
        },
        {
          title: '流域面雨量(m³/s)',
          key: 'drp',
          align:'center'
        },
        {
          title: '净雨量(m³/s)',
          key: 'cdrp',
          align:'center'
        },
        {
          title: '实测入流(m³/s)',
          key: 'inq',
          align:'center'
        },
        {
          title: '预报入流(m³/s)',
          key: 'finq',
          align:'center'
        },
        {
          title: '实测出流(m³/s)',
          key: 'otq',
          align:'center'
        },
        {
          title: '预报出流(m³/s)',
          key: 'fotq',
          align:'center'
        },
        {
          title: '实测水位(m)',
          key: 'rz',
          align:'center'
        },
        {
          title: '预报水位(m)',
          key: 'frz',
          align:'center'
        }
      ],
      data: []
    }
  },
  computed: mapGetters('resDetail', ['list', 'dispatchDetail']),
  watch: {
    list(data) {
      let { convertQ, convertZ, convertP } = this.$util
      let nowDate = new Date().formatDate('yyyy-MM-dd HH:00:00').toDate()

      data.forEach(value => {
        let time = value.ftm.toDate()
        
        if (nowDate > time) {
          value.finq = null
          value.fotq = null
          value.frz = null
        } else if (nowDate < time) {
          value.rz = null
          value.inq = null
          value.otq = null
        }
        
        let { finq, fotq, inq, otq, frz, rz, drp, cdrp } = value

        value.finq = finq === null ? null : convertQ(finq)
        value.fotq = fotq === null ? null : convertQ(fotq)
        value.inq = inq === null ? null : convertQ(inq)
        value.otq = otq === null ? null : convertQ(otq)
        value.frz = frz === null ? null : convertZ(frz)
        value.rz = rz === null ? null : convertZ(rz)
        value.drp = drp === null ? null : convertP(drp)
        value.cdrp = cdrp === null ? null : convertP(cdrp)
      })

      this.data = data
      this.setOptions(data)
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart, 'macarons')
  },
  methods: {
    onSelect(item, index) {
      this.$refs.tabs.handleChange(index)
    },
    setOptions(data) {
      let xAxis = [],
          yfinq = [],
          yfotq = [],
          yinq = [],
          yotq = [],
          yfrz = [],
          yrz = [],
          ydrp = [],
          ycdrp = []

      data.forEach(({ ftm, finq, fotq, inq, otq, frz, rz, drp, cdrp }, index) => {
        xAxis.push(ftm.toDate().formatDate("yyyy-MM-dd HH"))
        yfinq.push(finq)
        yfotq.push(fotq)
        yinq.push(inq)
        yotq.push(otq)
        yfrz.push(frz)
        yrz.push(rz)
        ydrp.push(drp)
        ycdrp.push(cdrp) 
      })

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter:data => {
            let str = ''

            if (data.length !== 0) {
              str += `${data[0].axisValue}<br/>`
              let drpValue = ''
              data.forEach(({ marker, seriesName, value, data }) => {
                if (value) {
                  str += `${marker}${seriesName}:${value}<br/>`
                }
              })
            }

            return str
          }
        },
        color: ['#e6a23c', '#e6a23c', '#f56c6c', '#f56c6c', '#409EFF', '#409EFF', '#b6a2de', '#2ec7c9'],
        axisPointer: {
          link: {
            xAxisIndex: 'all'
          }
        },
        grid: [
          {
            left: 50,
            right: 50,
            height: 140,
            top: 50
          }, 
          {
            left: 50,
            right: 50,
            height: 140,
            bottom: 40
          }
        ],
        xAxis: [
          {
            type : 'category',
            data: xAxis,
            position: 'top'
          },
          {
            gridIndex: 1,
            type : 'category',
            data: xAxis
          }
        ],
        yAxis: [
          {
            name : '降雨量(mm)',
            type : 'value',
            inverse: true,
            nameLocation: 'start',
            nameGap: 20,
            min: 0
          },
          {
            gridIndex: 1,
            name : '流量(m³/s)',
            type : 'value',
            nameLocation: 'start',
            nameGap: 20
          },
          {
            gridIndex: 1,
            name: "水位(m)",
            type: "value",
            nameLocation: 'start',
            nameGap: 20
            // show: false
          }
        ],
        series: [ 
          {
            name: "预报入流",
            data: yfinq,
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            name: "实测入流",
            data: yinq,
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1
          },
          {
            name: "预报出流",
            data: yfotq,
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            name: "实测出流",
            data: yotq,
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1
          },
          {
            name: "预报水位",
            yAxisIndex: 1,
            data: yfrz,
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 2,
            lineStyle: {
              normal: {
                type: 'dotted'
              }
            }
          },
          {
            name: "实测水位",
            yAxisIndex: 1,
            data: yrz,
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 2
          },
          {
            name: "降雨量",
            type: "bar",
            data: ydrp
          },
          {
            name: "净雨量",
            type: "bar",
            data: ycdrp,
            barGap: "-100%"
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
$margin: 10px;

.common-resDetail-rain {
  .ivu-tabs-bar {
    display: none;
  }
  .chart-content {
    width: 868px;
    height: 400px;
    padding: $margin;
    position: relative;
    .chart {
      height: 400px - $margin * 2;
      width: 868px - $margin * 2;
    }
    .res-box {
      width: 50px;
      background: url("~@/assets/overview/res.png");
      background-size: 100% 100%;
      height: 140px;
      position: absolute;
      right: $margin;
      bottom: $margin + 40px;
    }
  }
}
</style>

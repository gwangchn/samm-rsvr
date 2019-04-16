<template>
  <div class="Echarts">
    <div class="myChart" id="myChart"></div>
  </div>
</template>
<script>
  import echarts from "echarts";
  export default {
    components: {},
    name: "Echarts",
    data() {
      return {

      };
    },
    mounted() {
      let self = this;
      //流量降雨量数据
      this.$eventBus.$on('passZQdata', (d) => {
        let newArr = d.newArr != undefined ? d.newArr :[];
        let qAllx = [],
          qAllys = [],
          qAlly = [],
          RAlly = [];
        if (newArr && newArr.length > 0) {
          let maxQ = 0;
          let maxR = 0;
          newArr.map((x) => {
            qAllx.push(self.$util.formatDate(x.ftm, 'yyyy-MM-dd HH:mm'));
            let fqValue = Number(parseFloat(x.fq).toFixed(2));
            let qValue = Number(parseFloat(x.q).toFixed(2));
            let fppValue = Number(parseFloat(x.fpp).toFixed(2));
            fqValue > maxQ && (maxQ = fqValue);
            qValue > maxQ && (maxQ = qValue);
            fppValue > maxR && (maxR = fppValue);

            qAlly.push(fqValue);
            qAllys.push(qValue);
            RAlly.push(fppValue);
          });
          if (maxQ === 0) {
            maxQ = null
          } else {
            maxQ *= 2
          }
          if (maxR === 0) {
            maxR = null
          } else {
            maxR *= 2
          }

          self.init(qAllx, qAlly, qAllys, RAlly, maxQ, maxR);
        }
      });
      this.init([], [], [], []);
    },
    methods: {
      init(xdata, qdata, qdata1, rdata, maxQ, maxR) {
        let self = this;
        this.myChart = echarts.init(document.getElementById('myChart'));
        let option = {
          grid: {
            left: '2%',
            right: '2%',
            bottom: 50,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              //type: 'cross',
              animation: false,
              label: {
                backgroundColor: '#505765'
              }
            }
          },
          legend: {
            data: ['预测Q', '实测Q', '降雨量'],
            x: 'left'
          },
          dataZoom: [{
            show: true,
            realtime: true,
            start: 0,
            end: 50
          }],
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              onZero: false
            },
            data: xdata
          }],
          yAxis: [{
              name: '流量(m³/s)',
              type: 'value',
              max: maxQ
            },
            {
              name: '降雨量(mm)',
              type: 'value',
              max: maxR,
              inverse: true,
              nameLocation: 'start'
            }
          ],
          series: [{
              name: '预测Q',
              type: 'line',
              animation: false,
              areaStyle: {
                normal: {}
              },
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              data: qdata
            },
            {
              name: '实测Q',
              type: 'line',
              animation: false,
              areaStyle: {
                normal: {}
              },
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              data: qdata1
            },
            {
              name: '降雨量',
              type: 'bar',
              yAxisIndex: 1,
              animation: false,
              data: rdata,
              barCateGoryGap: 0
            }
          ]
        };

        this.myChart.setOption(option);
      }
    },
    destroyed() {
      this.$eventBus.$off('passZQdata');
    }
  };

</script>
<style lang="scss" scoped>
  .Echarts {
    height: 350px;
    width: 96%;
    margin-left: 2%;
    .myChart {
      width: 100%;
      height: 100%;
    }
  }

</style>

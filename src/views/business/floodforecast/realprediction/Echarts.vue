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
      this.init();
    },
    methods: {
      init() {
        let self = this;
        this.myChart = echarts.init(document.getElementById('myChart'));
        let option = {
          title: {
            //text: '雨洪过程图',
            x: 'center',
            align: 'right'
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: 50,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false,
              label: {
                backgroundColor: '#505765'
              }
            }
          },
          legend: {
            data: ['调洪Z', '实测Z',], //'降雨量'
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
            data: []
          }],
          yAxis: [{
              name: '水位(m)',
              type: 'value',
            },
            {
              name: '流量(m³/s)',
              type: 'value',
              inverse: true,
              nameLocation: 'start'
            }
          ],
          series: [{
              name: '调洪Z',
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
              data: []
            },
            {
              name: '实测Z',
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
              data: []
            },
            {
              name: '降雨量',
              type: 'bar',
              yAxisIndex: 1,
              animation: false,
              data: [],
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

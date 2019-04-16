<template>
  <div class="rTable" ref="element">
    <Tabs type="card">
      <TabPane label="计算输出">
        <Table border :height="tabHeight" :columns="columns" :data="dataModel"></Table>
      </TabPane>
      <TabPane label="分析数据">
        <div class="AnalysisBox">
          <div class="Asame">
            <div>洪峰流量</div>
            <div class="sFont">{{maxq}}m3/s</div>
            <div>{{ftm}}</div>
          </div>
          <div class="Asame">
            <div>洪水总量</div>
            <div class="sFont">{{sumq}}万m3</div>
          </div>
          <div class="Asame">
            <div>降水总量</div>
            <div class="sFont">{{sumfpp}}mm</div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  export default {
    components: {},
    name: "rTable",
    data() {
      return {
        columns: [{
            title: "时间",
            key: "ftm",
            align: "center"
          },
          {
            title: "出流",
            key: "fpp",
            align: "center"
          },
          {
            title: "水位",
            key: "fq",
            align: "center"
          },
          {
            title: "库容",
            key: "q",
            align: "center"
          },
          {
            title: "实测入流",
            key: "z",
            align: "center"
          },
          {
            title: "预报总入流",
            key: "z",
            align: "center"
          },
          // {
          //   title: '预报入流组成',
          //   align: 'center',
          //   children: [
          //       {
          //           title: 'Company Address',
          //           key: 'caddress',
          //           align: 'center',
          //           width: 200
          //       },
          //       {
          //           title: 'Company Name',
          //           key: 'cname',
          //           align: 'center',
          //           width: 200
          //       }
          //   ]
          // },
        ],
        dataModel: [],
        tabHeight: 100,
        maxq: "0",
        sumq: "0",
        sumfpp: "0",
        ftm: ""
      };
    },
    mounted() {
      this.$nextTick(function () {
        let self = this;
        let oTableH = this.$refs.element.offsetHeight - 50;
        this.tabHeight = parseInt(oTableH);
      });
    },
    methods: {},
    destroyed() {}
  };

</script>
<style lang="scss" scoped>
  .rTable {
    height: calc(100vh - 435px - #{$header-height});
    width: 98%;
    margin-left: 1%;

    .box {
      margin: 20px 0 0 30px;

      .sameH {
        height: 40px;
        line-height: 40px;

        span {
          display: inline-block;
          width: 70px;
        }
      }
    }

    .AnalysisBox {
      width: 100%;
      height: 100%;

      .Asame {
        width: 27%;
        margin: 0 3%;
        margin-top: 15px;
        float: left;
        text-align: center;

        div {
          font-size: 18px;
        }

        .sFont {
          font-size: 26px;
          color: red;
        }
      }
    }
  }

</style>
<style>
  .Tabtable .ivu-tabs-bar {
    margin-bottom: 0 !important;
  }

  .Tabtable .ivu-table td {
    height: 30px;
  }

  .Tabtable .ivu-table-wrapper .ivu-table-cell {
    padding-left: 0;
    padding-right: 0;
  }

</style>

<template>
  <div class="realRightPanel">
    <header class="header">
      <el-button type="success" size="small" > 保存 </el-button>
      <el-button class="button"  type="warning" size="small" > 发布 </el-button>
    </header>
    <section class="section">
      <div class="echartsBox">
        <Echarts></Echarts>
      </div>
      <div class="table" ref="tableHeight">
        <Table :height="Theight" :columns="columns1" :data="data1"></Table>
      </div>
    </section>
  </div>
</template>
<script>
  import Echarts from "@/views/business/floodforecast/realprediction/Echarts";
  export default {
    components: {
      Echarts
    },
    data() {
      return {
        Theight:'',
        columns1: [
                    {
                        title: '时间',
                        key: 'name'
                    },
                    {
                        title: '入流',
                        key: 'age'
                    },
                    {
                        title: '库水位',
                        key: 'address'
                    },
                    {
                        title: '泄流',
                        key: 'name'
                    },
                    {
                        title: '蓄量',
                        key: 'age'
                    },
                    {
                        title: '实测入流',
                        key: 'address'
                    },
                    {
                        title: '实测水位',
                        key: 'address'
                    }
                ],
                data1: []
      };
    },
    mounted(){
      this.Theight = parseInt(this.$refs.tableHeight.offsetHeight - 10);
    },
    methods: {
    }
  };

</script>

<style scoped lang="scss">
  $echarts-height:350px;
 .realRightPanel{
    width: calc(100% - 200px);
    height: calc(100vh - 40px - #{$header-height});
    float: left;
    .header{
      line-height: 40px;
      width: 100%;
      border-bottom: 1px solid #ddd;
      text-align: right;
      .el-button--small, .el-button--small.is-round{
        padding: 7px 15px;
      }
      .button{
        margin-right: 20px;
      }
    }
    .section{
      width: 100%;
      height: calc(100% - 41px);
      .echartsBox{
        width: 100%;
        height: $echarts-height;
        float: left;
      }
      .table{
        width: 100%;
        height: calc(100% - #{$echarts-height});
        float: left;
        padding:0 5px;
      }
    }
    
  }
</style>

<template>
  <div class="jopRightPanel">
    <header class="header">
      <el-button type="success" size="small" > 发布 </el-button>
      <el-button class="button"  type="warning" size="small" @click="callBack" > 返回 </el-button>
    </header>
    <rEcharts></rEcharts>
    <rTable></rTable>
  </div>
</template>

<script>
import rTable from './rTable';
import rEcharts from './rEcharts';
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  name: 'rightPanel',
  components:{
    rTable,
    rEcharts
  },
  data() {
    return {};
  },
  computed:{
    ...mapGetters('Jobforecast',['hideRight','changeList'])
  },
  methods:{
    callBack(){
      this.CHANGE_CHANGELIST(false);
      this.CHANGE_HIDERIGHT(true);
    },
    ...mapMutations('Jobforecast',['CHANGE_HIDERIGHT','CHANGE_CHANGELIST']),
  }
}
</script>
<style scoped lang="scss">
  $echarts-height:350px;
 .jopRightPanel{
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
  }
</style>

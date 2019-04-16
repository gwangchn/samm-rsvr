<template>
  <div class="settingparB">
    <div class="mapBox">
      <mapSetting class="map"></mapSetting>
      <MaptoolSet :sLive='sLive'></MaptoolSet>
    </div>
    <div class="setRightBox">
      <div class="titleBox">{{title}}</div>
      <div style="padding:10px 0;">
        测站名称：<el-input v-model="input" size="medium" placeholder="请输入内容" style="width:130px"></el-input>
        <div style="float:right;margin-top:8px;background:#ccc">浏览</div>
      </div>
      <div class="tableDiv" ref="tableHeight">
        <Table :height="Theight" :columns="columns1" :data="tableData"></Table>
      </div>
      <div style="padding:10px 0;">
        <el-button type="primary" size="mini" @click="nextStep(0)">上一步</el-button>
        <el-button type="primary" size="mini" @click="nextStep(2)">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import mapSetting from "@/map/mapSettingpar";
import MaptoolSet from '@/components/MaptoolSetting';
export default {
  components: {
    mapSetting,
    MaptoolSet
  },
  name: "Settingpar2",
  data() {
    return {
       title:"区域划分",
       input:"",
       Theight:"",
       sLive:false,
       columns1: [
                    {
                        title: '区域编码',
                        key: 'date',
                        width:110,
                        align:"center"
                    },
                    {
                        title: '面积',
                        key: 'name',
                        align:"center"
                    },
                    {
                        title: '备注',
                        key: 'address',
                        align:"center"
                    }
                ],
       tableData: [
         { date: 'WCAM00015R',name: '338',address: ''}, 
         ]
    };
  },
  methods: {
    nextStep(index) {
      this.$eventBus.$emit('stepto', {index:index});
    }
  },
  mounted() {
    this.Theight = parseInt(this.$refs.tableHeight.offsetHeight - 10);
  },
  destroyed() {
  }
};
</script>
<style lang="scss" scoped>
  .settingparB{
    height:calc(100vh - 96px - #{$header-height});
    .mapBox{
      width:calc(100vw - 389px);
      height:100%;
      float:left;
      .map{
        width:100%;
        height:100%;
      }
    }
    .setRightBox{
      width:250px;
      height:100%;
      float:right;
      background:#f5f7fa;
      padding: 0 10px;
      .titleBox{
        line-height:30px;
        color:#409eff;
        border-bottom: 2px solid #409eff;
      }
      .tableDiv{
        width: 100%;
        height: calc(100vh - 232px - #{$header-height});
      }
    }
  }
</style>
<style lang="scss">
.settingparB{
  .ivu-table-cell{
    padding-left: 0;
    padding-right: 0;
  }
}
</style>


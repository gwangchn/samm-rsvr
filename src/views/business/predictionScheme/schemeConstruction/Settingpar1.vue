<template>
  <div class='settingparA' style="">
    <div class="mapbox">
      <map-setting class="map"></map-setting>
      <MaptoolSet :sLive='sLive'></MaptoolSet>
    </div>
    <div class="setRightBox">
      <div class="titleBox">{{title}}</div>
      <div style="padding-top:10px;">
        测站名称：<el-input v-model="input" size="medium" placeholder="请输入内容" style="width:130px"></el-input>
        <div style="float:right;padding-top:8px;">取点</div>
      </div>
      <div style="padding-top:10px;">
        测站编码：<el-input v-model="input" size="medium" placeholder="请输入内容" style="width:130px"></el-input>
      </div>
      <div style="padding-top:10px;margin-left:28px">
        经度：<el-input v-model="input" size="medium" placeholder="请输入内容" style="width:130px"></el-input>
      </div>
      <div style="padding-top:10px;margin-left:28px">
        纬度：<el-input v-model="input" size="medium" placeholder="请输入内容" style="width:130px"></el-input>
      </div>
      <div class="btn">
        <el-button type="primary" size="small" style="width:150px;" @click="nextStep(1)">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import MaptoolSet from '@/components/MaptoolSetting';
import mapSetting from "@/map/mapSettingpar";
export default {
  components: {
    mapSetting,
    MaptoolSet
  },
  name: "Settingpar1",
  data() {
    return {
      title:"选择预报站",
      input:"",
      sLive:false,
    };
  },
  methods: {
    nextStep(index) {
      this.$eventBus.$emit('stepto', {index:index});
    }
  },
  mounted() {

  },
  destroyed() {
  }
};
</script>
<style lang="scss" scoped>
  .settingparA{
    height:calc(100vh - 96px - #{$header-height});
    .mapbox{
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
      .btn{
        text-align: center;
        line-height: 50px;
      }
    }
  }
</style>

<template>
  <div class="business" v-if="!menuHide">
    <el-menu
      router default-active="/Jobforecast"
      class="el-menu-vertical-demo"
      background-color="#fff"
      active-text-color="#ffd04b"
      >
      <el-submenu index="Jobforecast">
        <template slot="title">
          <Icon :size="iconSize" type="md-boat"></Icon>
          <span>洪水预报</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="Jobforecast">作业预报</el-menu-item>
          <el-menu-item index="realprediction">实时预报</el-menu-item>
          <el-menu-item index="amanagement">成果管理</el-menu-item>
          <el-menu-item index="autosetting">自动设置</el-menu-item>
          <el-menu-item index="warningmodel">预警模型</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="schemeConstruction">
        <template slot="title">
          <Icon :size="iconSize" type="ios-list-box"></Icon>
          <span>预报方案</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="schemeConstruction">方案构造</el-menu-item>
          <el-menu-item index="projectManagement">方案管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="realtimeAnalysis">
        <template slot="title">
          <Icon :size="iconSize" type="ios-warning"></Icon>
          <span>风险分析</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="realtimeAnalysis">实时分析</el-menu-item>
          <el-menu-item index="AchievementM">成果管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <div class="rightContent">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  name: 'business',
  data() {
    return {
      iconSize: 20
    };
  },
  computed:{
    ...mapGetters(['menuHide'])
  }
}
</script>

<style scoped lang="scss">
  .business{
    width: 130px;
    height: calc(100vh - #{$header-height});
    background:$bg-color;
    .el-menu {
      height: 100%;
      border: none;
      width: 100%;
      box-shadow: 3px 3px 5px #aaa;
    }
    .rightContent{
      width: calc(100% - 132px);
      height: calc(100vh - #{$header-height});
      position: absolute;
      top: $header-height;
      right: 0;
    }
  }
</style>
<style  lang="scss">
  $font-size : 13px;
  .business{
    .el-menu-item {
      min-width:130px !important;
      height: 40px !important;
      line-height: 40px !important;
    }
    .el-submenu__title{
      padding: 0 10px !important;
      height: 40px !important;
      line-height: 40px !important;
    }
    .el-submenu__title span{
      padding-left: 10px ;
      font-weight: 900;
      color: #000;
      font-size : $font-size;
    }
    .el-menu-item-group__title{
      padding:0;
    }
    .el-menu-item-group li{
      font-weight: 900;
      color: #000;
      font-size : $font-size;
    }
  }

</style>
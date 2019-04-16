<template>
  <div class="tabMenu" v-if="menuHide">
    <el-menu router default-active="/overview" 
    class="el-menu-vertical-demo"
    >
    <el-menu-item index="/overview">
      <Icon type="ios-apps" :size="iconSize" />
      <span slot="title">总览</span>
    </el-menu-item>
    <el-menu-item index="/weather">
      <Icon type="ios-cloud-circle" :size="iconSize" />
      <span slot="title">天气</span>
    </el-menu-item>
    <el-menu-item index="/rain">
      <Icon type="md-rainy" :size="iconSize" />
      <span slot="title">雨情</span>
    </el-menu-item>
    <el-menu-item index="/water">
      <Icon type="ios-water" :size="iconSize"  />
      <span slot="title">水情</span>
    </el-menu-item>
    <el-menu-item index="/warning">
      <Icon type="md-flash" :size="iconSize" />
      <span slot="title">预警</span>
    </el-menu-item>
    <el-menu-item index="/dispatch">
      <Icon type="ios-boat" :size="iconSize" />
      <span slot="title">调度</span>
    </el-menu-item>
    <el-menu-item index="/risk">
      <Icon type="ios-warning" :size="iconSize" />
      <span slot="title">风险</span>
    </el-menu-item>
  </el-menu>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Menu',
  data() {
    return {
       iconSize:18
    };
  },
  methods: {},
  mounted() {},
  computed:{
    ...mapGetters(['menuHide'])
  }
}
</script>

<style scoped lang="scss">
.tabMenu {
    height: calc(100vh - #{$header-height});;
    background:$bg-color; //#2c3347;
    float: left;
    top: $header-height;
    z-index: 200;
    .el-menu {
      height: calc(100vh - #{$header-height});
      border: none;
      width: $menu-width;
      box-shadow: 3px 3px 5px #aaa;
    }
  }
  
</style>
<style lang="scss">
  .tabMenu .el-menu-item {
    padding: 0 10px !important;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 13px !important;
  }
  .tabMenu .el-menu-item span{
    padding-left: 10px ;
    font-weight: 900;
    color: #000;
  }

</style>
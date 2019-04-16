<template>
  <div class="schemeConstruction">
    <topTitle :title='title'></topTitle>
      <div class="dialogDiv">
        <el-steps :active="active" simple>
          <el-step title="预报站选择" icon="el-icon-menu"></el-step>
          <el-step title="区域划分" icon="el-icon-info"></el-step>
          <el-step title="雨量站管理" icon="el-icon-edit-outline"></el-step><!--1  4-->
          <el-step title="方案定义" icon="el-icon-upload"></el-step><!--1基本参数设置-->
          <el-step title="计算管理" icon="el-icon-tickets"></el-step><!--关键节点设置  5 -->
        </el-steps>
        <div class="dialogContentDiv">
          <Settingpar1 v-if="active==0"></Settingpar1>
          <Settingpar2 v-if="active==1"></Settingpar2>
          <Settingpar3 v-if="active==2"></Settingpar3>
          <Settingpar4 v-if="active==3"></Settingpar4>
          <Settingpar5 v-if="active==4"></Settingpar5>
        </div>
      </div>
  </div>
</template>
<script>
  import topTitle from '../topTitle'
  import Settingpar1 from "@/views/business/predictionScheme/schemeConstruction/Settingpar1";
  import Settingpar2 from "@/views/business/predictionScheme/schemeConstruction/Settingpar2";
  import Settingpar3 from "@/views/business/predictionScheme/schemeConstruction/Settingpar3";
  import Settingpar4 from "@/views/business/predictionScheme/schemeConstruction/Settingpar4";
  import Settingpar5 from "@/views/business/predictionScheme/schemeConstruction/Settingpar5";
  export default {
    components: {
      Settingpar1,Settingpar2,Settingpar3,Settingpar4,Settingpar5,topTitle
    },
    name: "schemeConstruction",
    data() {
      return {
        active: 0,
        title:'方案构造'
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('预报方案未创建完成，确认关闭？').then(_ => {
            this.active = 0;
            done();
          }).catch(_ => {});
      },
      stepto(_index) {
        this.active = _index;
      },

    },
    mounted() {
      this.$eventBus.$on("stepto", status => {
        this.stepto(status.index);
      });
    },
    destroyed() {
      this.$eventBus.$off('stepto');
    }
  };
</script>
<style lang="scss" scoped>
  .schemeConstruction {
    width: 100%;
    height:calc(100vh - #{$header-height});
    .dialogDiv {
      width: 100%;
      height: calc(100vh - 50px - #{$header-height});
      margin-top:5px;
      .dialogContentDiv {
        width: 100%;
        height: calc(100vh - 100px - #{$header-height});
        background-color: rgba(245,247,250,1);
        margin-top: 5px;
      }
    }
  }
</style>
<style lang="scss">
  .projectManagement {
    .el-step.is-simple:not(:last-of-type) .el-step__title{
      max-width: 62%;
    }
    .ivu-table td{
      height:30px;
    }
    .el-dialog__body{
      padding: 10px 20px;
    }
    .el-dialog__header{
      padding: 10px 20px 10px;
    }
    .el-dialog__headerbtn{
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }
</style>


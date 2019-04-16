<template>
  <div class="settingparC">
    <div class="settingLeft" ref="tableHeight">
      <Table 
        ref="selection"
        @on-select="checkAll"
        @on-select-cancel="handleCancelSelect" 
        @on-select-all="handelSelectAll"
        @on-select-all-cancel="handelSelectCanelAll"  
        :height="Theight" 
        :columns="columns1" 
        :data="data1">
      </Table>
    </div>
    <div class="settingContent">
      <div class="forward" @click="handelSelect">
        <Button :disabled="nowSelectData.length?false:true" :size="buttonSize" type="primary" >
            选中
          <Icon type="md-arrow-round-forward"/>
        </Button>
      </div>
      <div @click="handleRemoveSelect">
        <Button :disabled="nowSelectRightData.length?false:true" :size="buttonSize" type="primary">
          <Icon type="md-arrow-round-back"/>
          取消
        </Button>
      </div>
    </div>
    <div class="settingRight">
      <div style="padding-top:10px;">
        流域单元：
        <el-select style="width:200px" size="mini" v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="width:300px;padding:10px 0;">
        权重算法：
        <el-select style="width:200px;" size="mini"  v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div style="float:right;margin-top:8px;background:#ccc;border-radius:2px;">计算...</div>
      </div>
      <div class="tableRightHeight" ref="tableRightHeight">
        <Table 
          :height="RHeight"
          @on-select="checkRightAll"
          @on-select-cancel="handleRightCancelSelect" 
          @on-select-all="handleRemoveAll" 
          @on-select-all-cancel="handelSelectRemovecancelAll"
          :columns="columns" 
          :data="selectArr">
        </Table>
      </div>
      <div class="total">
        <div class="totalsite">共{{selectArr.length}}个雨量站</div>
        <div class="totalNum">1</div>
      </div>
      <div class="btn">
        <el-button type="primary" size="mini" @click="nextStep(1)">上一步</el-button>
        <el-button type="primary" size="mini" @click="nextStep(3)">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: "Settingpar3",
  data() {
    return {
      selectArr:[],  // 右边列表
      buttonSize: 'large',
      options: [],
        value: '',
      columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center',
                    },
                    {
                        title: '测站编码',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '测站名称',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '权重',
                        key: 'address',
                        align: 'center'
                    },
                ],
      columns1: [
                    {
                        type: 'selection',
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: '测站编码',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '测站名称',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '测站类型',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '测站位置',
                        key: 'address',
                        align: 'center'
                    }
                ],
      data1: [
              {
                  name: '220581000001',
                  age: "中心",
                  address: '',
                  date: ''
              },
              {
                  name: '22058100000',
                  age: "小太平河",
                  address: '',
                  date: ''
              },
          ],
      nowSelectData: [], // 左边选中列表数据
      nowSelectRightData: [], // 右边选中列表数据
      Theight:'',
      RHeight:'',
    };
  },
  methods: {
    nextStep(index) {
      this.$eventBus.$emit('stepto', {index:index});
    },
    handelSelectAll(selection){//全选 选中  事件
      this.nowSelectData = selection; 
    },
    handleCancelSelect(section, row) {
      this.nowSelectData = section;
    },
    handleRightCancelSelect(section, row) {
      this.nowSelectRightData = section;
    },
    handelSelectCanelAll(){
        this.nowSelectData = []
    },
    handelSelectRemovecancelAll(){
       this.nowSelectRightData = [];
    },
    handleRemoveAll(selection){//全选 取消  事件   
      this.nowSelectRightData = selection;
    },
    checkAll(row){
      this.nowSelectData = row;
    },
    checkRightAll(row) {
      this.nowSelectRightData = row;
    },
    // 选中
    handelSelect(){   
      this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData) 
      this.handleRemoveTabList(this.nowSelectData,  this.data1);
      this.nowSelectData = [];
    },
    // 取消
    handleRemoveSelect() {
      this.data1 = this.handleConcatArr(this.data1, this.nowSelectRightData) 
      this.handleRemoveTabList(this.nowSelectRightData,  this.selectArr);
      this.nowSelectRightData = [];
    },
    handleConcatArr(selectArr, nowSelectData) {
      let arr = [];
      arr = arr.concat(selectArr, nowSelectData);   
      return arr;
    },
    handleRemoveTabList(isNeedArr,  originalArr) {
      if(isNeedArr.length && originalArr.length) {
         for(let i=0; i<isNeedArr.length; i++) {
            for(let k=0; k<originalArr.length; k++) {
              if(isNeedArr[i]["name"] === originalArr[k]["name"]) {
                originalArr.splice(k, 1);   
              }
            }
         }
      }
    }
  },
  mounted() {
    this.Theight=parseInt(this.$refs.tableHeight.offsetHeight - 10);
    this.RHeight=parseInt(this.$refs.tableHeight.offsetHeight - 160);
  },
  destroyed() {
  }
};
</script>
<style lang="scss" scoped>
  .settingparC{
    // height: 100%;
    height:calc(100vh - 96px - #{$header-height});
    .settingLeft{
      width:calc(100vw - 723px);
      height:calc(100vh - 96px - #{$header-height});
      float:left;
      padding:5px;
    }
    .settingContent{
      width:130px;
      height:100%;
      float:left;
      text-align: center;
      line-height: 100%;
      background: #fff;
      .forward{
        text-align: center;
        line-height:150px;
      }
    }
    .settingRight{
      width:455px;
      height:100%;
      float:left;
      padding: 0 10px;
      .tableRightHeight{
        width:100%;
        height:calc(100vh - 250px - #{$header-height});
      }
      .total{
        height:20px;
        line-height: 20px;
        .totalsite{
          float:left;
        }
        .totalNum{
          float:right;
        }
      }
      .btn{
        position:absolute;
        bottom:15px;
        text-align: center;
        // line-height: 20px;
      }
    }
  }
</style>
<style lang="scss">
.settingparC{
  .ivu-table-cell {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>


<template>
  <div class="settingparfive" style="height:100%;">
    <div style="padding: 5px">
      <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="innerVisible = true">添加</el-button>
      <el-button type="primary" size="mini" icon="el-icon-picture">生成预报结构图</el-button>
    </div>
    <div class="tablebox" ref="tableHeight">
      <Table  :height="THeight" :columns="columns2" :data="nodedata"></Table>
    </div>
    <div style="height: 40px;">
      <el-row :gutter="80">
        <el-col :span="8">&nbsp;</el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="nextStep(3)">上一步</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini">完&nbsp;&nbsp;&nbsp;&nbsp;成</el-button>
        </el-col>
        <el-col :span="8">&nbsp;</el-col>
      </el-row>
    </div>
      <el-dialog title="添加节点" :visible.sync="innerVisible" width="900px" append-to-body>
        <div class="innerdialogDiv">
          <el-form ref="innerform" :model="innerform" :rules="innerformrules" size="mini" label-width="110px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="计算输入类型：">
                  <el-select v-model="innerform.calcinputtp" placeholder="请选择计算输入类型" @change="changeCalcInputTp()" style="width: 100%">
                    <el-option label="水文站" value="RR"></el-option>
                    <el-option label="流域" value="LY"></el-option>
                    <el-option label="水位站" value="ZZ" :disabled='selectdisabled'></el-option>
                    <el-option label="闸坝站" value="DD" :disabled='selectdisabled'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="输入编码：">
                  <el-select v-model="innerform.inputcd" placeholder="请选择输入编码" style="width: 100%">
                    <el-option v-for="item in stcds" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="输出编码：">
                  <el-select v-model="innerform.outputcd" placeholder="请选择输出编码" style="width: 100%">
                    <el-option v-for="item in stcds" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="产流模型选择：">
                  <el-select v-model="innerform.clmodel" placeholder="请选择产流模型" :disabled='modeldisabled' style="width: 100%">
                    <el-option label="三水源蓄满" value="SMS_3"></el-option>
                    <el-option label="超渗产流" value="CSCL" :disabled='selectdisabled'></el-option>
                    <el-option label="混合产流" value="HHCL" :disabled='selectdisabled'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="河网汇流模型：">
                  <el-select v-model="innerform.hwhlmodel" placeholder="请选择河网汇流模型"  @change="changeHwhlModelTp()":disabled='modeldisabled' style="width: 100%">
                    <el-option label="滞后演算" value="LAG_3"></el-option>
                    <el-option label="线性水库" value="XXSK"></el-option>
                    <el-option label="单位线" value="DWX"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="河道汇流模型：">
                  <el-select v-model="innerform.hdhlmodel" placeholder="请选择河道汇流模型" style="width: 100%">
                    <el-option label="马斯京根" value="MSK"></el-option>
                    <el-option label="一维水动力" value="YWSDL" :disabled='selectdisabled'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="计算顺序：">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8"> <!-- 新增 -->
                <el-form-item label="输入数据来源：">
                  <el-select v-model="innerform.sourceofinputdata" :disabled='sourcedata' placeholder="请输入数据来源" style="width: 100%">
                    <el-option label="预报" value="SOID"></el-option>
                    <el-option label="实时" value="SS"></el-option>
                    <el-option label="基流" value="JL"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8"><!-- 新增 -->
                <el-form-item label="输出断面：">
                  <el-select v-model="innerform.scdmdata" placeholder="请输出断面" style="width: 100%">
                    <el-option label="" value=""></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-tabs type="border-card" v-model="activeName">
              <el-tab-pane label="产流模型参数" :disabled='modeldisabled' name="clmodel">
                <div class="tabDivLeft">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="K：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="IM：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="KG：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="WM：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="WUM：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="WLM：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="SM：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="B：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="EX：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="C：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="KI：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="tabDivRight">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      状态变量初始值：
                    </el-col>
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-form-item label="W0：" label-width="50px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="S0：" label-width="50px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-form-item label="WU：" label-width="50px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="FR0：" label-width="50px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-form-item label="WL：" label-width="50px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
              <el-tab-pane label="河网汇流模型参数" :disabled='modeldisabled' name="hwhlmodel">
                <div>【{{this.zhystitle}}】参数：</div>
                <div v-if="zhysshow">
                  <div class="tabDivLeft" >
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="CL：" label-width="70px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="CG：" label-width="70px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="L：" label-width="70px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="XE：" label-width="70px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="KE：" label-width="70px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="N：" label-width="70px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="tabDivRight">
                    <el-row :gutter="10">
                      <el-col :span="24">
                        状态变量初始值：
                      </el-col>
                    </el-row>
                    <el-row :gutter="5">
                      <el-col :span="24">
                        <el-form-item label="Q0：" label-width="50px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div v-show="xxskshow"><!-- 新增 -->
                  <div class="tabDivLeft" >
                    <el-row :gutter="10">
                      <el-col :span="10">
                        <el-form-item label="Pa：" label-width="70px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item label="植被系数：" label-width="90px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="12">
                      <el-col :span="10">
                        <el-form-item label="单位线：" label-width="70px">
                          <el-select v-model="innerform.dwxmodel" placeholder="请选择产流模型" style="width: 100%">
                            <el-option label="2018/7/17" value="SDWX"></el-option>
                            <el-option label="2018/8/12" value="SDWX_1"></el-option>
                            <el-option label="2018/9/19" value="SDWX_2"></el-option>
                            <el-option label="2018/10/23" value="SDWX_3"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                          <el-button type="primary" size="mini">编辑</el-button>
                          <el-button type="success" size="mini">保存</el-button>
                          <el-button type="text" @click="tableBtnShow">表格</el-button>
                          <el-button type="text" @click="echartsBtnShow">图形</el-button>
                      </el-col>
                    </el-row>
                    <!-- <div class="echartsbox"> -->
                      <div class="myChart" id="echarts" v-show="echartsshow"></div>
                    <!-- </div> -->
                    <div v-if="tableshow" class="SetFiveTable">
                      <Table :columns="columns1" height="110" :data="data1"></Table>
                    </div>
                  </div>
                  <div class="tabDivRight">
                    <el-row :gutter="10">
                      <el-col :span="24">
                        状态变量初始值：
                      </el-col>
                    </el-row>
                    <el-row :gutter="5">
                      <el-col :span="24">
                        <el-form-item label="Q0：" label-width="50px">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="河道汇流模型参数" name="hdhlmodel">
                <div class="tabDivLeft">
                  <el-row :gutter="10">
                    <el-col :span="20">
                      <el-form-item label="XE：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="20">
                      <el-form-item label="KE：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="20">
                      <el-form-item label="N：" label-width="70px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="tabDivRight">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      状态变量初始值：
                    </el-col>
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="24">
                      <el-form-item label="Q0：" label-width="50px">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-row style="margin-top:5px">
              <el-col :span="11">&nbsp;</el-col>
              <el-col :span="2">
                <el-button type="primary" size="mini">保存</el-button>
              </el-col>
              <el-col :span="11">&nbsp;</el-col>
            </el-row>
          </el-form>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  components: {

  },
  name: "Settingpar5",
  data() {
    return {
      columns2: [
                    {
                        title: '序号',
                        key: 'index',
                        width: 80,
                        align:"center",
                        fixed: 'left'
                    },
                    {
                        title: '计算输入类型',
                        key: 'calcinputtp',
                        align:"center",
                    },
                    {
                        title: '输入编号',
                        key: 'inputcd',
                        align:"center",
                    },
                    {
                        title: '输出编号',
                        key: 'outputcd',
                        align:"center",
                    },
                    {
                        title: '产流计算模型',
                        key: 'clmodel',
                        align:"center",
                    },
                    {
                        title: '河网汇流计算模型',
                        key: 'hwhlmodel',
                        align:"center",
                    },
                    {
                        title: '河道汇流计算模型',
                        key: 'hdhlmodel',
                        align:"center",
                    },
                    {
                        title: '计算顺序',
                        key: 'calcorder',
                        align:"center",
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        align:"center",
                        width: 130,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                }, '删除')
                            ]);
                        }
                    }
                ],
      nodedata:[
        {index:1,calcinputtp:'水文站',inputcd:'220581000001',outputcd:'220581000001',clmodel:'',hwhlmodel:'',hdhlmodel:'MSK',calcorder:'1'},
      ],
      THeight:"",
      echartsshow:true,
      tableshow:false,
      zhysshow:true,
      xxskshow:false,
      zhystitle:"滞后演算",
      innerVisible: false,
      innerform: {
        calcinputtp: 'RR',
        inputcd: '62010631',
        outputcd: '62010102',
        clmodel: 'SMS_3',
        hwhlmodel: 'LAG_3',
        hdhlmodel: 'MSK',
        sourceofinputdata:'SOID',
        scdmdata:'',
        dwxmodel:'2018/7/17',
      },
      innerformrules: {},
      selectdisabled: true,
      modeldisabled: true,
      sourcedata:false,
      activeName: 'hdhlmodel',
      stcds: [
        {value: '62010631',label: '62010631'},
        {value: '62010653',label: '62010653'},
        {value: '62010102',label: '62010102'}
      ],
      columns1: [
                    {
                        title: '日期',
                        key: 'name',
                        align:"center",
                    },
                    {
                        title: '流量',
                        key: 'age',
                        align:"center",
                    }
                ],
      data1: [
                    {
                        name: '4/30 0',
                        age: 112,
                    },
                    {
                        name: '5/2 0',
                        age: 100,
                    },{
                        name: '5/6 0',
                        age: 89,
                    },
                    {
                        name: '5/8 0',
                        age: 86,
                    },
                    {
                        name: '5/10 0',
                        age: 72,
                    },
                    {
                        name: '5/12 0',
                        age: 64,
                    }
                ]          
    };
  },
  methods: {
    echartsBtnShow(){
      this.echartsshow = true;
      this.tableshow = false;
    },
    tableBtnShow(){
       this.echartsshow = false;
      this.tableshow = true;
    },
    nextStep(index) {
      this.$eventBus.$emit('stepto', {index:index});
    },
    changeCalcInputTp(){
      if("RR"==this.innerform.calcinputtp){
        this.activeName = 'hdhlmodel';
        this.modeldisabled = true;
        this.sourcedata = false;
      }else{
        this.modeldisabled = false;
        this.sourcedata = true;
      }
    },
    changeHwhlModelTp(){
      if(this.innerform.hwhlmodel == "LAG_3"){
        this.zhysshow = true;
        this.xxskshow = false;
        this.zhystitle ="滞后演算"
      }else{
        this.zhysshow = false;
        this.xxskshow = true;
        this.zhystitle ="单位线"
        this.echartsinit();
      }
    },
    echartsinit(){
        this.myChart = echarts.init(document.getElementById('echarts'));
        let option = {
            grid: {
                top:'5%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            //  legend: {
            //     data:['邮件营销','联盟广告',],
            //     x: 'left',
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['4/30 0','5/2 0','5/6 0','5/8 0','5/10 0','5/12 0']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name:'邮件营销',
                type:'line',
                stack: '总量',
                data:[112, 100, 89, 86, 72, 64]
            }]
        };
        this.myChart.setOption(option);
      },
  },
  
  mounted() {
    this.THeight=parseInt(this.$refs.tableHeight.offsetHeight - 20);
  },
  destroyed() {
  }
}
</script>
<style lang="scss" scoped>
.settingparfive{
    width: 100%;
    height:calc(100vh - 96px - #{$header-height});
  .tablebox{
    width: 100%;
    height: calc(100vh - 175px - #{$header-height});
    padding: 5px;
    padding-top: 0px;
  }
  
}
.innerdialogDiv {
    width: 100%;
    height: 490px;
    background-color: rgba(245,247,250,1);
    padding: 10px;
    .tabDivLeft {
      float: left;
      width: 70%;
      height: 206px;
      padding:10px;
      border-right: 1px solid rgba(228,231,237,1);
      position: relative;
      .myChart{
        width:544px;
        height:110px;
      }
    }
    .tabDivRight {
      float: left;width: 30%;padding: 10px
    }
  }
</style>
<style lang="scss">
.SetFiveTable{
    .ivu-table td{
      height:30px;
    }
  }
  .el-dialog__wrapper{
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



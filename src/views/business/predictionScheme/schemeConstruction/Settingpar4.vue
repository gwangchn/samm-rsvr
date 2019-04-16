<template>
  <div  class="setfour">
    <el-form ref="form" :model="form" :rules="formrules" label-width="100px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="方案名称：" prop="plannm">
            <el-input v-model="form.plannm"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="方案编码：" prop="plancd">
            <el-input v-model="form.plancd"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="预报站点：">
            <el-select v-model="form.stcd" placeholder="请选择预报站点" style="width: 100%">
              <el-option v-for="item in forecaststnmoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
         <el-col :span="11">
          <el-form-item label="预报站码：">
            <el-input v-model="form.sitenum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="11">
          <el-form-item label="输出类型：">
            <el-select v-model="form.outputtp" placeholder="请选择输出类型" style="width: 100%">
              <el-option label="入库流量" value="inq"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-form-item label="制作人：">
            <el-input v-model="form.user"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
           <el-col :span="7">
          <el-form-item label="时段长：">
            <el-select v-model="form.t" placeholder="请选择预时段长" style="width: 100%">
              <el-option label="1h" value="1"></el-option>
              <el-option label="2h" value="2"></el-option>
              <el-option label="3h" value="3"></el-option>
              <el-option label="4h" value="4"></el-option>
              <el-option label="6h" value="6"></el-option>
              <el-option label="8h" value="8"></el-option>
              <el-option label="12h" value="12"></el-option>
              <el-option label="24h" value="24"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="预热期：">
            <el-input v-model="form.warmupPeriod"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">小时&nbsp;</el-col>
        <el-col :span="7">
          <el-form-item label="预见期：">
            <el-input v-model="form.foresightperiod"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">小时</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="方案描述：">
            <el-input v-model="form.planexplain" type="textarea" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">&nbsp;</el-col>
        <el-col :span="2">
          <el-button type="primary" size="mini" @click="backStep(2)">上一步</el-button>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="2">
          <el-button type="primary" size="mini" @click="nextStep('form',4)">下一步</el-button>
        </el-col>
        <el-col :span="11">&nbsp;</el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>

export default {
  components: {

  },
  name: "Settingpar4",
  data() {
    return {
      form: {
        plannm:'',
        plancd:'',
        sitenum:'3300000',
        user:"admin",
        stcd:'123123123',
        t:"1",
        foresightperiod:'',//预见期
        warmupPeriod:'',//预热期
        outputtp:"inq",
        planexplain:""
      },
      formrules: {
        plannm: [
          { required: true, message: '请输入方案名称', trigger: 'blur'}
        ],
        plancd: [
          { required: true, message: '请输入方案编码', trigger: 'blur' }
        ]
      },
      forecaststnmoptions: [{
        value: '123123123',
        label: '中心'
      }],
    };
  },
  methods: {
    backStep(index){
      this.$eventBus.$emit('stepto', {index:index});
    },
    nextStep(formName,index) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$eventBus.$emit('stepto', {index:index});
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  mounted() {
  },
  destroyed() {
  }
};
</script>
<style lang="scss" scoped>
.setfour{
  width: 100%;
  height:calc(100vh - 96px - #{$header-height});
  padding: 20px;
}
</style>

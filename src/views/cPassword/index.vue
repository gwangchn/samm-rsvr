<template>
  <div style="padding-top:80px;">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">修改密码</h3>
      <el-form-item prop="account">
        <Input type="text" prefix="ios-contact" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"
          @keyup.enter.native="handleSubmit2" />
      </el-form-item>
      <el-form-item prop="oldPassWord">
        <Input type="password" prefix="ios-lock" v-model="ruleForm2.oldPassWord" auto-complete="off" placeholder="原始密码"
          @keyup.enter.native="handleSubmit2" />
      </el-form-item>
      <el-form-item prop="passWord">
        <Input type="password" prefix="ios-lock" v-model="ruleForm2.passWord" auto-complete="off" placeholder="新密码"
          @keyup.enter.native="handleSubmit2"  /> <!--@canplaythrough="focus" -->
      </el-form-item>
      <el-form-item prop="confirmPassWord">
        <Input type="password" prefix="ios-lock" v-model="ruleForm2.confirmPassWord" auto-complete="off" placeholder="确认新密码"
          @keyup.enter.native="handleSubmit2" />
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { confirmlogin } from "@/api/login.js"
  export default {
    data() {
      return {
        ruleForm2: {
          account: "",
          passWord: "",
          oldPassWord: "",
          confirmPassWord: ""
        },
        rules2: {
          account: [{
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }],
          oldPassWord: [{
            required: true,
            message: "请输入原始密码",
            trigger: "blur"
          }],
          passWord: [{
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          }],
          confirmPassWord: [{
            required: true,
            message: "请确认新密码",
            trigger: "blur"
          }]
        }
      };
    },
    methods: {
      handleSubmit2(ev) {
        let _this = this;
        this.$refs.ruleForm2.validate(async valid => {
          if (valid) {
            let param = {
              userName: this.ruleForm2.account,
              oldPassWord: this.ruleForm2.oldPassWord,
              confirmPassWord: this.ruleForm2.confirmPassWord,
              passWord: this.ruleForm2.passWord
            };
            try {
                let res = await confirmlogin(param);
                if (res.data.result && res.data.result != null) {
                  let message = res.data.result[0][300];
                  _this.$message.success(message);
                  setTimeout(() => {
                    _this.$router.push({
                      path: "/overview"
                    });
                  }, 1500);
                } else {
                  let message = res.data.message.message;
                  _this.$message.error(message);
                };
              } catch (err) {
                if (err && err.response) {
                  switch (err.response.status) {
                    case 400:
                      err.message = "错误请求";
                      break;
                    case 401:
                      err.message = "未授权，请重新登录";
                      break;
                    case 403:
                      err.message = "拒绝访问";
                      break;
                    case 404:
                      err.message = "请求错误,未找到该资源";
                      break;
                    case 405:
                      err.message = "请求方法未允许";
                      break;
                    case 408:
                      err.message = "请求超时";
                      break;
                    default:
                      err.message = `连接错误${err.response.status}`;
                  }
                } else {
                  err.message = "连接到服务器失败";
                }
                _this.$message.error(err.message);
              };
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    watch: {},
    mounted() {
      //默认用户名
      this.ruleForm2.account = sessionStorage.getItem('account');
    }
  };

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }

    .remember {
      margin: 0px 0px 35px 0px;
    }
  }

  .VerificationCode {
    width: 40%;
    float: right;
    line-height: 38px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    -moz-border-radius: 4px;
    /* Firefox */
    -webkit-border-radius: 4px;
    /* Safari 和 Chrome */
    border-radius: 4px;
    /* Opera 10.5+, 以及使用了IE-CSS3的IE浏览器 */
    text-align: center;
    cursor: pointer;
  }

</style>

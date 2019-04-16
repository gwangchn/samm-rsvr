<template>
  <div class="loginbox">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <el-form-item prop="account">
        <Input size='large' prefix="ios-contact" type="text" v-model="ruleForm2.account" auto-complete="off"
          placeholder="请输入账号" @keyup.enter.native="handleSubmit2" />
      </el-form-item>
      <el-form-item prop="checkPass">
        <Input size='large' prefix="ios-lock" type="password" v-model="ruleForm2.checkPass" auto-complete="off"
          placeholder="请输入密码" @keyup.enter.native="handleSubmit2" />
      </el-form-item>
      <el-form-item prop="VerificationCode">
        <Input size='large' prefix="ios-key" style=" width:50%;" type="text" v-model="ruleForm2.VerificationCode"
          auto-complete="off" placeholder="请输入验证码" @keyup.enter.native="handleSubmit2" />
        <div class="VerificationCode" @click="createCode">{{codeV}}</div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button size='large' type="primary" style="width:100%;" @click.native.prevent="handleSubmit2">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { login, getUserInfo } from "@/api/login"
  export default {
    data() {
      return {
        ruleForm2: {
          account: "",
          checkPass: "",
          VerificationCode: ""
        },
        rules2: {
          account: [{
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }],
          checkPass: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
          VerificationCode: [{
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }]
        },
        codeV: ""
      };
    },
    methods: {
      handleSubmit2(ev) {
        let _this = this;
        this.$refs.ruleForm2.validate(async valid => {
          if (valid) {
            let VerificationCode = this.ruleForm2.VerificationCode.toUpperCase();
            if (VerificationCode == 0) {
              _this.$message("请输入验证码");
            } else if (this.codeV != VerificationCode) {
              _this.$message("验证码不正确，请重新输入");
              VerificationCode = " ";
              _this.createCode();
            } else {
              try {
                let { account: username } = this.ruleForm2
                let res = await login({
                  username,
                  password: _this.ruleForm2.checkPass
                })
                if (res.data.message != undefined && res.status == '200') {
                  this.$message.error(res.data.message);
                } else {
                  let Authorization = res.headers.authorization;
                  if (Authorization) {
                    let userRes
                    sessionStorage.setItem("samm-auth", Authorization); //存一个请求头
                    userRes = await getUserInfo(username)
                    sessionStorage.setItem("samm-userinfo", JSON.stringify(userRes.data.result[0]))
                    this.$router.push({
                      path: "/overview"
                    })
                  }
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
              }
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      //生成随机码
      createCode() {
        //首先默认code为空字符串
        let code = "";
        //设置长度，这里看需求，我这里设置了4
        let codeLength = 4;
        //设置随机字符
        let random = new Array(
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        );
        //循环codeLength 我设置的4就是循环4次
        for (let i = 0; i < codeLength; i++) {
          //设置随机数范围,这设置为0 ~ 36
          let index = Math.floor(Math.random() * 36);
          //字符串拼接 将每次随机的字符 进行拼接
          code += random[index];
        }
        //将拼接好的字符串赋值给展示的Value
        this.codeV = code;
      }
    },
    mounted() {
      this.createCode();
    }
  };
</script>

<style lang="scss" scoped>
.loginbox {
  padding-top: 150px;
  background-image: url('~@/assets/login/rsvr.png');
  background-size: 100% 100%;
  width: 100%;
  height: 100vh;
  position: relative;
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 25;

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
    line-height: 28px;
    margin-top: 6px;
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
    font-family: 'DFKai-SB';
    background-color: #BEE5CE;
  }
}
</style>

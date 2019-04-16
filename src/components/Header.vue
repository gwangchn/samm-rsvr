<template>
  <div class="header">
    <div class="logo">
      <div class="img">
        <img src="../assets/imgs/logo.png">
      </div>
      <span class="title">{{title}}</span>
    </div>
    <div class="userinfo">
      <span class="user" @click="userClick">
        <Icon type="md-contact" />
        <Icon type="android-person"></Icon>
        <span v-text="userName"></span>
        <Icon :type="!this.userLShow?'md-arrow-dropdown':'md-arrow-dropup'" style="margin-right: 20px; "></Icon>
      </span>
      <div class="userList" v-show="userLShow" v-on:mouseleave="userLeave">
        <span>
          <Icon type="md-cog"></Icon>
          <a href="#" @click="checkPassword" v-text="checkPass"></a>
        </span>
        <span>
          <Icon type="md-exit"></Icon>
          <a href="#" @click="logout" v-text="loginLogout"></a>
        </span>
      </div>
    </div>
    <div class="menu">
      <ul>
        <li v-for="(item,index) in systemNames" :key="index" @click="changeSys(item)">
          {{item.name}}
        </li>
      </ul>
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
  name: 'Header',
  data() {
    return {
      systemNames:[
        {name:'信息服务'},
        {name:'业务管理'},
        {name:'系统管理'}
      ],
      userName: "admin",
      title: '小型水库群智能预警系统',
      checkPass: "修改密码",
      loginLogout: "退出登录",
      userLShow: false
    };
  },
  computed:{
    ...mapGetters(['menuHide'])
  },
  methods:{
    changeSys(res){
      if(res.name == '系统管理'){
        this.$router.push({
          path: "/usermanage"
        });
        this.MENU_HIDE(true);
      }else if(res.name == '信息服务'){
        this.$router.push({
          path: "/Overview"
        });
        this.MENU_HIDE(true);
      }else if(res.name == '业务管理'){
        this.$router.push({
          path: "/floodforecast"
        });
        this.MENU_HIDE(false);
      }
    },
    userClick: function () {
      this.userLShow = !this.userLShow;
    },
    userLeave: function () {
      this.userLShow = false;
    },
    checkPassword(){
      this.$router.push({
        path: "/cPassword"
      });
    },
    logout(){
      sessionStorage.removeItem("authorization");
      this.$router.push({
        path: "/login"
      });
    },
    ...mapMutations(['MENU_HIDE'])
  }
}
</script>

<style scoped lang="scss">
.header {
    position: relative;
    height: $header-height;
    width: 100%;
    background:$bg-color;
    //background: linear-gradient(to bottom ,rgb(114,240,240), $bg-color);
    .logo {
      float: left;
      .img {
        height: 36px;
        width: 36px;
        position: relative;
        float: left;
        vertical-align: middle;
        line-height: $header-height;
        text-align: center;
        margin-left:0 10px 0  10px;
        margin-left: 5px;
        img {
          margin-top: 9px;
          height: 32px;
          width: 32px;
          text-align: center;
        }
      }
      .title {
        position: relative;
        vertical-align: middle;
        line-height: $header-height;
        font-style: normal;
        font-size: 20px;
        @include font_color($font-color);
        font-family: '微软雅黑';
        text-shadow: 1px 1px 2px #333;
        font-weight: 900;
        margin-left: 10px;
        letter-spacing: 10px;
      }
    }
    .menu{
      float: right;
      ul{
        height: 100%;
        margin-right: 10px;
        li{
          font-size: 14px;
          height: 100%;
          float: left;
          line-height: $header-height -  20px;
          margin: 10px 15px 0 15px;
          @include font_color($font-color);
          cursor: pointer;
          border-bottom: 2px solid #fff;
        }
        li:hover{
          color: gold;
          border-bottom: 2px solid gold;
        }
      }
    }
    .userinfo {
      float: right;
      font-size: 14px;
      color: #fff;
      line-height: $header-height;
      position: relative;
      z-index: 40;
      margin-right: 5px;
      .user {
        cursor: pointer;
        span {
          margin: 0 4px;
          cursor: pointer;
        }
      }
      .userList {
        width: 100px;
        height: 80px;
        position: absolute;
        z-index: 11;
        background: $bg-color;
        right: 10px;
        text-align: center;
        margin-top: 5px;
        border-radius: 5px;
        span {
          display: block;
          height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
        a{
          color: #fff;
          margin-left: 5px;
        }
        a:hover{
          color: #000;
        }
        span:hover {
          opacity: .9;
          color: black;
        }
      }
    }
  }
</style>

<!-- 用户管理 -->
<template>
  <div class="usermanagement">
    <div class="queryMenu">
      <div class="menuLeft">
        <span>{{title}}</span>
      </div>
      <div class="menuRight">
        <Button class="add" size='small' icon="plus-circled" @click="add">新增</Button>
        <Button class="play" size='small' icon="play" @click="pausePlay(1)">启用</Button>
        <Button class="pause" size='small' icon="pause" @click="pausePlay(0)">禁用</Button>
        <Button class="delete" size='small' icon="trash-a" @click="del">删除</Button>
        <Button class="reset" size='small' icon="android-lock" @click="reset">重置密码</Button>
      </div>
    </div>
    <!-- 弹窗 -->
    <Modal v-model="modal1" class="usermodal" title="新增用户" @on-ok="addLog">
      <div style="width:100%;padding:10px 0;">
        <div style="padding:5px 10px">
          <span style="width:70px;display: inline-block">用户名:</span>
          <el-input v-model="unm" size="small" placeholder="请输入用户名" style="width:120px;"></el-input>
          <span style="color:red;">*必填</span>
        </div>
        <div style="padding:5px 10px">
          <span style="width:70px;display: inline-block">账号:</span>
          <el-input v-model="lid" size="small" placeholder="请输入账号" style="width:120px;"></el-input>
          <span style="color:red;">*必填</span>
        </div>
        <div style="padding:5px 10px">
          <span style="width:70px;display: inline-block">密码:</span>
          <el-input v-model="pwd" size="small" placeholder="请输入密码" style="width:120px;"></el-input>
          <span style="color:red;">*必填</span>
        </div>
        <div style="padding:5px 10px">
          <span style="width:70px;display: inline-block">手机号:</span>
          <el-input v-model="upe" size="small" placeholder="请输入手机号" style="width:120px;"></el-input>
          <span style="color:red;">*必填</span>
        </div>
        <div style="padding:5px 10px">
          <span style="width:70px;display: inline-block">邮箱:</span>
          <el-input v-model="uel" size="small" placeholder="请输入邮箱" style="width:120px;"></el-input>
          <span style="color:red;">*必填</span>
        </div>
        <div style="padding:5px 10px">
          <span style="width:70px;display: inline-block">职务:</span>
          <el-input v-model="ujob" size="small" placeholder="请输入职务" style="width:120px;"></el-input>
          <span style="color:red;">*必填</span>
        </div>
        <div style="padding:5px 10px">
          <div style="width:70px;float:left;margin-right:5px;">权限:</div>
          <Select v-model="userId" style="width:120px">
            <Option v-for="item in userIds" :value="item.rid" :key="item.rid">{{ item.rnm }}</Option>
          </Select>
        </div>
        <div style="padding:5px 10px">
          <div style="width:70px;float:left;margin-right:5px">水库编码:</div>
          <el-cascader size="small" :options="districtList" style="width: 238px" v-model="district" :change-on-select="true"></el-cascader>
        </div>
      </div>
    </Modal>
    <div class="oTableBox" ref='oTableBox'>
      <Table highlight @on-select="handleSelection" ref="selection" :columns="columns1" :data="dataTotal"></Table>
    </div>
    <div class="Pagination">
      <el-pagination :page-count="5" layout="prev, pager, next,jumper" :total="total" :page-size='page_size'
        :current-page.sync="current" @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {getU,getUserlist,pausePlay,resetPassword,delList,addList} from "@/api/system/usermanage/index"
  import {
    mapGetters,
    mapMutations, 
    mapActions
  } from 'vuex'
  export default {
    name: "usermanage",
    data() {
      return {
        title: "用户管理",
        keyword: "",
        multipleSelection: [],
        permissions: "",
        status: "",
        modal1: false,
        userIds: [],
        userId: "",
        lid: "",
        unm: "",
        pwd: "",
        upe: "",
        uel: "",
        ujob: "",
        district: [],
        columns1: [{
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "用户名",
            key: "unm",
            align: "center"
          },
          {
            title: "账号",
            key: "lid",
            align: "center"
          },
          {
            title: "职务",
            key: "ujob",
            align: "center"
          },
          {
            title: "手机",
            key: "upe",
            align: "center"
          },
          {
            title: "e-mail",
            key: "uel",
            align: "center"
          },
          {
            title: "权限",
            key: "rnm",
            align: "center"
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              if (params.row.stts == 1) {
                params.row.status = '启用';
              } else {
                params.row.status = '禁用';
              }
              return h('div', [
                h('span', {
                  props: {
                    type: 'error',
                    size: 'small'
                  }
                }, params.row.status)
              ]);
            }
          }
        ],
        dataTotal: [],
        page_size: 10,
        current: 1,
        total: 50,
        totalData: []
      };
    },
    watch: {},
    computed:{
      ...mapGetters('rain', ['districtList'])
    },
    mounted() {
      let self = this;
      getUserlist({status: ""}).then(res => {
        let data = res.data.result;
        self.init(data);
      });
      getU("").then(res => {
        let data = res.data.result;
        self.userIds = data;
        if (data.length > 0) {
          self.userId = data[0].rid;
        }
      });
      this.getStation();
    },
    methods: {
      //分页改变页数
      changePage() {
        this.dataTotal = this.totalData[this.current - 1];
      },
      //初始化表格
      init: function (obj) {
        let _ = require("lodash");
        let tableHeight = parseInt(this.$refs.oTableBox.offsetHeight - 40);
        let num = parseInt(tableHeight / 30);

        this.totalData = _.chunk(obj, num);
        this.page_size = num;
        this.total = obj.length;
        this.dataTotal = this.totalData[this.current - 1];
      },
      //添加
      add() {
        this.modal1 = true;
      },
      async addLog() {
        let {district} = this;
        let oLength = district.length;
        let {lid,unm,pwd,upe,uel,ujob,userId} = this;
        let para = {
          lid: lid,
          unm: unm,
          pwd: pwd,
          upe: upe,
          uel: uel,
          ujob: ujob,
          rid: userId,
          f : oLength> 0 ? district[oLength-1].substr(district[oLength-1].length - 1):'',
          dscd : oLength> 0 ? district[oLength-1].substr(0,district[oLength-1].length - 1): ''
        };
        if (para.lid == '' || para.unm == '' || para.pwd == '' || para.upe == '' || para.uel == '' || para.ujob == '' ||
          para.rid == '') {
          this.$message({
            message: '请填写用户信息',
            type: 'warning'
          });
        } else {
          let res = await addList(para);
          this.init(res.data.result);
        }
      },
      //删除
      async del() {
        let param = this.multipleSelection;
        if (param && param.length < 1) {
          this.$message({
            message: "请先选择一条或多条信息!",
            type: "warning"
          });
        } else {
          let para = [];
          param.map(x => {
            para.push(x.uid);
          });
          let res = await delList({data:para});
          this.init(res.data.result);
        }
      },
      //启用禁用
      async pausePlay(status) {
        let param = this.multipleSelection;
        if (param && param.length != 1) {
          this.$message({
            message: "请先选择一条信息!",
            type: "warning"
          });
        } else {
          let para = {
            status: status,
            uid: param[0].uid,
            lid: param[0].lid
          };
          let res = await pausePlay(para);
          this.init(res.data.result);
        }
      },
      //重置密码
      async reset() {
        let param = this.multipleSelection;
        if (param && param.length != 1) {
          this.$message({
            message: "请先选择一条信息!",
            type: "warning"
          });
        } else {
          let para = {
            lid: param[0].lid
          };
          let res = await resetPassword(para);
          if (res.data.result && res.data.status == 0) {
            this.$message({
              message: "重置密码成功!",
              type: "success"
            });
          }
        }
      },
      //获取选中行的数据
      handleSelection: function (val) {
        this.multipleSelection = val;
      },
      ...mapActions('rain',['getStation'])
    }
  };

</script>
<style lang="scss" scoped>
  .usermanagement{
    position: absolute;
    height: calc(100vh - #{$header-height});;
    width: calc(100vw - #{$menu-width});
    top: $header-height;
    left: $menu-width;
    .queryMenu {
    height: 40px;
    width: 100%;
    background: #e4e4e4;
    font-size: 13px;

    .menuLeft {
      float: left;
      line-height: 40px;
      margin-left: 10px;
      color: black;

      span {
        margin-left: 5px;
      }

      i {
        cursor: pointer;
      }
    }

    .menuRight {
      float: right;
      line-height: 40px;

      .search {
        margin-right: 20px;
      }

      .reset {
        margin-right: 20px;
      }

      i {
        margin: 0 2px 0 10px;
        font-style: normal;
      }
    }
  }

  .oTableBox {
    padding: 0 20px;
    margin-top: 20px;
    height: calc(100vh - 150px);
  }

  .Pagination {
    width: 100%;
    position: absolute;
    height: 50px;
    bottom: 0px;
    text-align: center;
  }
}
</style>
<style>
.usermodal .ivu-modal .ivu-modal-footer{
    padding: 5px;
    display: block;
  }
</style>


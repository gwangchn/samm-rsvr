<template>
    <div class="RightPanel" :style="style">
      <span class="rpline"></span>
      <div class="rp-title">
        {{District}}
        </div> 
      <div class="rp-tab">
        <Tabs type="card" size="small">
          <TabPane label="全部">
            <slot name="all"></slot>
          </TabPane>
          <TabPane label="关注">
            <slot name="follow"></slot>
          </TabPane>   
          <TabPane label="高级">
            <slot name="senior"></slot>
          </TabPane>
        </Tabs>
      </div>
      <div class="button"  @click="action">
        <i :class="iconArrow"></i>
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
    name: 'RightPanel',
    data() {
      return {
        District:'梅河口市'
      };
    },
    computed: {
      iconArrow() {
        return this.showFlag ? "el-icon-arrow-right" : "el-icon-arrow-left";
      },
      style() {
        let {showFlag,initWidth} = this;
        return {
          width: initWidth +'px',
          transform: `translateX(${showFlag ? 0 : initWidth}px)`
        };
      },
      ...mapGetters(['initWidth','showFlag'])
    },
    mounted(){},
    methods:{
       action() {
        let {showFlag,initWidth} = this;
        let stated = !showFlag;
        this.SET_SHOWFLAG(stated);
        if (showFlag) {
          this.SET_RPANELWIDTH(0);
        } else {
          this.SET_RPANELWIDTH(initWidth)
        }
      },
      ...mapMutations(['SET_RPANELWIDTH','SET_SHOWFLAG'])
    },
    beforeDestroy(){
      this.SET_SHOWFLAG(false);
      this.action();
    }
    
}
</script>
<style scoped lang="scss">
  .RightPanel{
    height: calc(100vh - #{$header-height});
    position:absolute;
    right:0;
    top: $header-height;
    border-left:1px solid #ccc;
    @include bg_color($panel-color);
    transition: all 0.4s ease;
    .rp-title{
      line-height: 30px;
      font-size: 14px;
      color: $bg-color;
      font-weight: 600;
      padding-left: 5px;
      display: inline-block;
    }
    .rpline{
      float: left;
      display: block;
      width: 3px;
      height: 18px;
      margin: 6px 0 0 10px;
      background: $bg-color;
    }
    .button{
      width: 12px;
      position:absolute;
      top:50%;
      left:-12px;
      @include bg_color($bg-color);
      color:#fff;
      line-height:70px;
      text-align: center;
      border-radius: 3px;
      cursor: pointer;
      transform: translateY(-50%);
    }
  }
</style>
<style>
   .RightPanel .ivu-tabs-nav{
     float:right;
    }
    .RightPanel .ivu-tabs-bar{
      margin-bottom: 5px;
    }
    .RightPanel .ivu-tabs-mini .ivu-tabs-tab{
      padding: 2px 16px;
    }
    .RightPanel .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active{
      font-weight: 600;
      background: #fff;
      height: 25px;
    }
    .RightPanel .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab{
      padding: 0px 15px 0 15px;
      font-size: 13px;
      margin-right: 5px;
      height: 25px;
      line-height: 25px;
      /* color: #414758; */
      background: #fff;
    }
    .RightPanel .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused{
      border-color: #2d8cf0!important;
    }
    .RightPanel .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-container{
      height: 25px;
    }
</style>

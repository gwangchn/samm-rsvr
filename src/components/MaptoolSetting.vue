<template>
  <div class="Maptool">
    <div class="Changemapm"  :style="style">
      <transition name="el-fade-in-linear">
         <ul class="hideUl" >
          <li v-if='sLive'>
            <span slot="label" @click="changeTab('tabLive')">
              <Icon type="ios-clock"></Icon> 实况
            </span>
            <transition name="el-fade-in-linear">
              <div class="live" v-show="tabs.tabLive">
                <el-radio-group v-model="radiolive" v-for="(item,index) in timeBox" :key='index'  @change="liveChange">
                  <el-radio :label="item.label">{{item.label}}h</el-radio>
                </el-radio-group>
              </div>
            </transition>
          </li>
          <li v-if='sLive'>
            <span slot="label" @click="changeTab('tabForecast')">
              <Icon type="ios-paper"></Icon> 预报
            </span>
            <transition name="el-fade-in-linear">
              <div class="live" v-show="tabs.tabForecast">
                <el-radio-group v-model="radioforecast" v-for="(item,index) in timeBox" :key='index' @change="foreChange">
                  <el-radio :label="item.label">{{item.label}}h</el-radio>
                </el-radio-group>
              </div>
            </transition>
          </li>
          <li>
            <span slot="label" @click="changeTab('tabAddMap')">
              <Icon type="ios-browsers"></Icon> 叠加
            </span>
            <transition name="el-fade-in-linear">
              <div class="addMapm" v-show="tabs.tabAddMap">
                <el-checkbox-group v-model="checksites" @change="changeSites">
                  <el-checkbox v-for="item in mapsites" :label="item" :key="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </transition>
          </li>
          <li class="secondC">
            <span slot="label" @click="changeTab('tabmap')">
              <Icon type="ios-locate"></Icon> 地图
            </span>
            <transition name="el-fade-in-linear">
              <div class="live" v-show="tabs.tabmap">
                <el-radio-group v-model="radio" @change="changeRadio($event)">
                  <el-radio :label="`img_w`">卫星图</el-radio>
                  <el-radio :label="`ter_w`">地形图</el-radio>
                  <el-radio :label="`vec_w`">交通图</el-radio>
                </el-radio-group>
              </div>
            </transition>
          </li>
        </ul>
      </transition>
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
  name: 'Maptool',
  props: {
    sLive: {
      type: Boolean,
      default: true
    },
    oType:{
      type: String,
      default: 'Water'
    }
  },
  data() {
    return {
      timeBox:[
        {label:'1'},
        {label:'3'},
        {label:'6'},
        {label:'12'},
        {label:'24'}
      ],
      checksites: ['行政中心', '河流水系'],
      mapsites: ['监测站点', '行政中心','河流水系'],
      radiolive: '1',
      radioforecast: '0',
      radio:'vec_w',
      tabs:{
        tabAddMap: false,
        tabmap: false,
        tabLive: false,
        tabForecast: false
      }
    }
  },
  beforeMount(){
    this.SET_HIDETIMEBAR(false)
  },
  mounted() {
    let self = this;
  },
  methods: {
    changeSites(value){
      //写逻辑
      this.$eventBus.$emit('Superposimap', value); 
    },
    //切换Tab
    changeTab: function (value) {
      let _this = this;
      let tabs = Object.keys(this.tabs);
      tabs.forEach(x=>{
        if(x == value){
          _this.tabs[x] = !_this.tabs[x] ;
        }else{
          _this.tabs[x] = false;
        }
      });
      //改变timebar 隐藏显示状态
      if(value == 'tabForecast'){
        this.SET_HIDETIMEBAR(true);
      }else{
        this.SET_HIDETIMEBAR(false);
      };
    },
    //更改地图底图
    changeRadio: function (e) {
      this.tabs.tabmap = false;
      this.$eventBus.$emit('mapType', e); //创建一个钩子用于改变地图底图
    },
    liveChange(value) {
      this.radioforecast = 0;
      this.tabs.tabLive = false;
      let {oType} = this;
      this.$emit(`lfchangeTime${oType}`, {
        type: 'S',
        value: value
      });
      //控制格点雨量显示隐藏
      this.$eventBus.$emit('dLatticerain',true);
    },
    foreChange(value) {
      this.radiolive = 0;
      this.tabs.tabForecast = false;
      let {oType} = this;
      this.$emit(`lfchangeTime${oType}`, {
        type: 'Y',
        value: value
      });
      //控制格点雨量显示隐藏
      this.$eventBus.$emit('dLatticerain',false)
    },
    ...mapMutations(['SET_HIDETIMEBAR'])
  },
  computed: {
    style() {
      let {sinitWidth,showFlag} = this;
      return {
          right: sinitWidth + 20 +'px',
          transform: `translateX(${showFlag ? 0 : sinitWidth}px)`
        }
    },
    ...mapGetters(['sinitWidth','showFlag','Hidetimebar'])
  },
  beforeDestroy() {}
}
</script>

<style scoped lang="scss">
  .Changemapm {
    transition: all 0.5s ease;
    position: absolute;
    top: 115px;
    z-index: 3;
    line-height: 30px;
    .hideUl {
      background: $maptool-color;
      height: 30px;
      float: right;
    }
    li {
      float: left;
      width: 60px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      color: #606266;
      span {
        cursor: pointer;
      }
      position: relative;
    }
    li:hover {
      span {
        color: rgb(100, 185, 249);
      }
    }
    .addMapm {
      background: $maptool-color;
      position: absolute;
      width: 140px;
      top: 35px;
      left: -35px;
      -moz-border-radius: 5px;
      /* Firefox */
      -webkit-border-radius: 5px;
      /* Safari 和 Chrome */
      border-radius: 5px;

      /* Opera 10.5+, 以及使用了IE-CSS3的IE浏览器 */
      .el-checkbox {
        margin-left: 0px;
        padding-left: 10px;
        width: 100%;
        text-align: left;
        height: 24px;
        line-height: 24px !important;
        font-size: 12px;
        padding-top: 3px;
      }
    }

    .live {
      left: -10px;
      top: 35px;
      background: $maptool-color;
      position: absolute;
      width: 90px;
      -moz-border-radius: 5px;
      /* Firefox */
      -webkit-border-radius: 5px;
      /* Safari 和 Chrome */
      border-radius: 5px;

      /* Opera 10.5+, 以及使用了IE-CSS3的IE浏览器 */
      .el-radio-group {
        height: 100%;
        width: 100%;
        .el-radio {
          text-align: left;
          width: 100%;
          height: 30px;
          line-height: 30px;
          padding-left: 10px;
          margin-left: 0;
        }
      }
    }
  }

</style>
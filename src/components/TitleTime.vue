<template>
  <div class="TitleTime" :style="style">
    <div class="title">
      {{commonTitle}}
    </div>
    <div v-show="hidetitleTime" class="time">
      {{titleTime}}
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'
export default {
  name: 'TitleTime',
  data() {
    return {
    };
  },
  mounted() {},
  computed: {
    style() {
      let {initWidth,showFlag} = this;
      return {
          right: initWidth + 350 +'px',
          transform: `translateX(${showFlag ? 0 : initWidth}px)`
        }
    },
    ...mapGetters(['initWidth','showFlag','commonTitle','titleTime','hidetitleTime'])
  },
  methods: {
    ...mapMutations(['SET_COMMONTITLE','SET_TITLETIME'])
  }
}
</script>
<style scoped lang="scss">
  .TitleTime{
    transition: all 0.5s ease;
    position: absolute;
    width: 200px;
    height: 60px;
    top: 60px;
    z-index: 3;
    .title{
      width: 100%;
      line-height: 30px;
      text-align: center;
      color: #000;
      font-size: 18px;
      background: linear-gradient( 
            to right, 
            rgba(35,198,200,0.1), 
            rgba(35,198,200,0.3), 
            rgba(35,198,200,0.4), 
            rgba(35,198,200,0.5), 
            rgba(35,198,200,0.5), 
            rgba(35,198,200,0.8),
            rgba(35,198,200,0.8),
            rgba(35,198,200,0.8),
            rgba(35,198,200,0.5), 
            rgba(35,198,200,0.5), 
            rgba(35,198,200,0.4), 
            rgba(35,198,200,0.3), 
            rgba(35,198,200,0.1))
     }
    .time{
      width: 100%;
      line-height: 20px;
      text-align: center;
      font-size: 14px;
      margin-top: 10px;
      border-radius: 10px;
      color: #000;
      background: linear-gradient( 
            to right, 
            rgba(248, 224, 5,0.1), 
            rgba(248, 224, 5,0.3), 
            rgba(248, 224, 5,0.4), 
            rgba(248, 224, 5,0.5), 
            rgba(248, 224, 5,0.5), 
            rgba(248, 224, 5,0.8),
            rgba(248, 224, 5,0.8),
            rgba(248, 224, 5,0.9),
            rgba(248, 224, 5,0.8),
            rgba(248, 224, 5,0.8),
            rgba(248, 224, 5,0.5), 
            rgba(248, 224, 5,0.5), 
            rgba(248, 224, 5,0.4), 
            rgba(248, 224, 5,0.3), 
            rgba(248, 224, 5,0.1))
     }
  }
</style>
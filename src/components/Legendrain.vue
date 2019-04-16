<template>
  <div class="legendBox">
    <div class="Legendtitle">图例</div>
    <div class="Legend">
      <ul>
        <li v-for="(item,index) in items" :key="index">
          <span :style="{background:item.color }">{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="legentNum">
      <ul>
        <li v-for="(item,index) in items" :key="index">
          <span>{{item.num}}</span>
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
    name: "Legend",
    props: {
      gap: {
        type: String,
        default: '1'
      }
    },
    data() {
      return {};
    },
    computed: {
      items() {
        let arr = [{
          num: "0.1-1.5",
          color: '#AAEC93',
          name:''
        }, {
          num: "1.6-6.9",
          color: '#3BB73F',
          name:''
        }, {
          num: "7.0-14.9",
          color: '#64B9F9',
          name:''
        }, {
          num: "15-39.9",
          color: '#0302F8',
          name:''
        }, {
          num: "40-49.9",
          color: '#F701F7',
          name:''
        }, {
          num: "≥50",
          color: '#78073A',
          name:''
        }]
        let arrNum = []
        let arrType = ['小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨']
        switch (Number(this.gap)) {
          case 1:
            arrNum = ['0.1-1.5', '1.6-6.9', '7.0-14.9', '15-39.9', '40-49.9', '≥50']
            break
          case 3:
            arrNum = ['0.1-2.9', '3.0-9.9', '10-19.9', '20-49.9', '50-69.9', '≥70']
            break
          case 6:
            arrNum = ['0.1-3.9', '4.0-12.9', '13-24.9', '25-59.9', '60-119.9', '≥120']
            break
          case 12:
            arrNum = ['0.1-4.9', '5.0-14.9', '15-29.9', '30-69.9', '70-139.9', '≥140']
            break
          case 24:
            arrNum = ['0.1-9.9', '10-24.9', '25-49.9', '50-99.9', '100-249.9', '≥250']
            break
          case 72:
            arrNum = ['0.1-29.9', '30-74.9', '75-149.9', '150-299.9', '300-749.9', '≥750']
            break
        }
        arrNum.forEach((value, index) => {
          arr[index].num = `${value}`
        })
        arrType.forEach((value, index) => {
          arr[index].name = `${value}`
        })
        return arr
      }
    },
    mounted() {},
    destroyed() {}
  };

</script>
<style lang="scss" scoped>
  .legendBox {
    width: 150px;
    height: 160px;
    position: absolute;
    z-index: 11;
    bottom: 20px;
    left: 110px;
    color: #ffffff;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    .Legendtitle {
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      font-weight: 900;
      color: #000;
    }
    .Legend {
      width: 58px;
      height: calc(100% - 30px);
      float: left;
      margin-left: 15px;
      ul li {
        height: 20px;
        line-height: 20px;
        span {
          display: block;
          width: 100%;
          height: 100%;
          text-align: center;
          letter-spacing: 1px;
          font-size: 12px;
        }
      }
    } 
    .legentNum {
      height: calc(100% - 30px);
      width: 75px;
      float: right; // background: #ddd;
      text-align: left;
      font-size: 12px;
      color: #000;
      ul li {
        width: 100%;
        line-height: 20px;
        text-align: left;
        padding-left: 10px;
        span {
          width: 100%;
          font-size: 12px;
        }
      }
    }
  }

</style>

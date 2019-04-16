<template>
  <div class="Legend">
    <div class="title">{{title}}</div>
    <ul >
      <li v-for="(item,index) in dList" :key="index">
        <img :src="baseUrl+item.src">
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Legend',
  props: {
    legendList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      title:'图例',
      baseUrl: process.env.BASE_URL,
      dList:[]
    };
  },
  methods: {
  },
  mounted() {
    this.dList = this.legendList
  }
}
</script>
<style scoped lang="scss">
  .Legend{
    position: absolute;
    bottom: 20px;
    left:110px;
    padding:5px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 5px;
    .title{
      font-weight: 900;
      font-size: 14px;
      line-height: 25px;
    }
    li {
      display: flex;
      line-height: 20px;
      width: 90px;
      flex-direction: center;
      justify-content: space-around;
      img {
        height: 16px;
        width: 16px;
      }
      span {
        font-size: 12px;
        text-align: right;
        width: 60px;
        font-weight: 900;
      }
    }
  }
</style>